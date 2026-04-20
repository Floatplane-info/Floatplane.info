import {error, redirect} from "@sveltejs/kit";
import Typesense from "typesense";
import type {PageServerLoad} from "./$types";
import {env} from "$env/dynamic/private";
import type {FloatplanePost} from "./types.ts";

const client = new Typesense.Client({
    nodes: [{ host: "search.ajg0702.us", port: 443, protocol: "https" }],
    apiKey: env.SEARCH_KEY
});

export const load: PageServerLoad = async ({platform, url}) => {
    const q = url.searchParams.get('q');
    if(!q) throw redirect(302, '/');

    const ai = platform?.env.AI;
    if(!ai) throw error(503, "AI not available");

    const embeddedQuery = await ai.run("@cf/qwen/qwen3-embedding-0.6b", {
        queries: q
    }, { gateway: { id: "floatplane-info" } })
        .then(r => {
            const embedding = r.data?.[0];
            if(!embedding) throw new Error("No embedding returned: " + JSON.stringify(r));
            return embedding;
        });

    return await client.multiSearch.perform<FloatplanePost[]>({
        searches: [
            {
                collection: "floatplane",
                q,
                query_by: ["title", "textMarkdown"],
                vector_query: `embedding:(${JSON.stringify(embeddedQuery)})`,
                sort_by: "_text_match(bucket_size: 5):desc,releaseDate:desc,_text_match:desc",
                exclude_fields: ["embedding", "creator.liveStream", "creator.subscriptionPlans"],
                highlight_fields: ["text", "title", "textMarkdown"],
                page: 1,
                per_page: 50
            }
        ]
    })
        .then(r => r.results[0])

}