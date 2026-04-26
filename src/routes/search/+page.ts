import type { PageLoad } from "./$types";
import type {SearchApiResponse} from "../api/search/+server.ts";
import {retry} from "$lib/utils";


export const load: PageLoad = async ({url, fetch}) => {
    const searchUrl = new URL(url);
    searchUrl.pathname = "/api/search";
    return await retry(() =>
        fetch(searchUrl)
            .then(r => r.json() as Promise<SearchApiResponse>)
    );
}