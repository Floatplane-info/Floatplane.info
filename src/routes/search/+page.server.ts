import {error, redirect} from "@sveltejs/kit";
import {Client} from "typesense";
import type {PageServerLoad} from "./$types";
import {env} from "$env/dynamic/private";
import type {FloatplanePost} from "./types.ts";
import {dev} from "$app/environment";

let client: Client;

export const load: PageServerLoad = async ({platform, url}) => {
    let q = url.searchParams.get('q');
    if(q === "") q = "*";
    if(!q) throw redirect(302, '/');

    if(!client) {
        client = new Client({
            nodes: [{ host: "search.ajg0702.us", port: 443, protocol: "https" }],
            apiKey: env.SEARCH_KEY
        });
    }

    const ai = platform?.env.AI;
    if(!ai) throw error(503, "AI not available");

    const embedStart = Date.now();
    const embeddedQuery = q === "*" ? undefined : await ai.run("@cf/qwen/qwen3-embedding-0.6b", {
        queries: q
    }, { gateway: { id: "floatplane-info" } })
        .then(r => {
            const embedding = r.data?.[0];
            if(!embedding) throw new Error("No embedding returned: " + JSON.stringify(r));
            return embedding;
        });
    const embedTime = Date.now() - embedStart;

    const similarityField = "_text_match";
    // const similarityField = "_vector_distance";
    const sortBy = url.searchParams.get("sort");
    let sort_by = `${similarityField}(bucket_size: 5):desc,timestamp:desc,_vector_distance:desc`;
    if(sortBy && sortBy !== "default") {
        if(sortBy === "oldest") {
            sort_by = "timestamp:asc"
        } else if(sortBy === "newest") {
            sort_by = "timestamp:desc"
        } else if(sortBy === "relevant") {
            sort_by =  similarityField + ":desc"
        }
    }

    let filterBy: string[] = [];

    const creator = url.searchParams.get("creator");
    if(creator) {
        const creators = creator.split(",");
        const pos = creators
            .filter(c => !c.startsWith("!"));
        const neg = creators
            .filter(c => c.startsWith("!"))
            .map(c => c.substring(1));

        if(pos.length > 0) filterBy.push(`creator.id:[${pos.join(",")}]`);
        if(neg.length > 0) filterBy.push(`creator.id:![${neg.join(",")}]`);
    }

    const channel = url.searchParams.get("channel");
    if(channel) {
        const channels = channel.split(",");
        const pos = channels
            .filter(c => !c.startsWith("!"));
        const neg = channels
            .filter(c => c.startsWith("!"))
            .map(c => c.substring(1));

        if(pos.length > 0) filterBy.push(`channel.id:[${pos.join(",")}]`);
        if(neg.length > 0) filterBy.push(`channel.id:![${neg.join(",")}]`);
    }


    const results = await client.multiSearch.perform<(FloatplanePost & {timestamp: number})[]>({
        searches: [
            {
                collection: "floatplane",
                q,
                query_by: ["title", "textMarkdown"],
                query_by_weights: [4, 1],
                vector_query: q === "*" ? undefined : `embedding:(${JSON.stringify(embeddedQuery)}, alpha: 0.6, distance_threshold:0.10)`,
                sort_by,
                exclude_fields: ["embedding", "creator.liveStream", "creator.subscriptionPlans"],
                highlight_fields: ["text", "title", "textMarkdown"],
                facet_by: ["creator.id", "channel.id"],
                facet_return_parent: "creator.id,channel.id",
                max_facet_values: 1000,
                filter_by: filterBy.length > 0 ? filterBy.join(" && ") : undefined,
                page: 1,
                per_page: 100,
                rerank_hybrid_matches: true,
                prefix: false,
                drop_tokens_threshold: 10,
                highlight_full_fields: "title"
            }
        ]
    })
        .then(r => r.results[0]);

    if(!sortBy || sortBy === "default") {
        results.hits
            ?.sort((a, b) => {
                const aDaysAgo = ((Date.now() / 60e3) - a.document.timestamp) / (24 * 60);
                const aScore = (a.hybrid_search_info.rank_fusion_score * 0.7) +
                    (a.hybrid_search_info.rank_fusion_score * (1/Math.pow(aDaysAgo, 1/3)) * 0.3);
                const bDaysAgo = ((Date.now() / 60e3) - b.document.timestamp) / (24 * 60);
                const bScore = (b.hybrid_search_info.rank_fusion_score * 0.7) +
                    (b.hybrid_search_info.rank_fusion_score * (1/Math.pow(bDaysAgo, 1/3)) * 0.3);
                return bScore - aScore;
            });
    }

    return {
        results,
        embedTime,
        q
    }

}