import {error, redirect} from "@sveltejs/kit";
import {Client} from "typesense";
import type {PageServerLoad} from "./$types";
import {env} from "$env/dynamic/private";
import type {FloatplanePost} from "./types.ts";

let client: Client;

export const load: PageServerLoad = async ({platform, url}) => {
    const q = url.searchParams.get('q');
    if(!q) throw redirect(302, '/');

    if(!client) {
        client = new Client({
            nodes: [{ host: "search.ajg0702.us", port: 443, protocol: "https" }],
            apiKey: env.SEARCH_KEY
        });
    }

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
                query_by: ["title"],
                vector_query: q === "*" ? undefined : `embedding:(${JSON.stringify(embeddedQuery)}, alpha: 0.4, distance_threshold:0.10)`,
                sort_by: "_text_match(bucket_size: 20):desc,releaseDate:desc,_text_match:desc",
                exclude_fields: ["embedding", "creator.liveStream", "creator.subscriptionPlans"],
                highlight_fields: ["text", "title", "textMarkdown"],
                page: 1,
                per_page: 50,
                rerank_hybrid_matches: true
            }
        ]
    })
        .then(r => r.results[0])

}