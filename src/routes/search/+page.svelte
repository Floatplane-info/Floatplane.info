<script lang="ts">
    import type { PageProps } from './$types';
    import VideoResult from "$lib/VideoResult.svelte";
    import SearchIcon from "@lucide/svelte/icons/search";
    import * as InputGroup from "$lib/components/ui/input-group";
    import {page} from "$app/state";

    let query = $state(page.url.searchParams.get("q") ?? undefined);


    let {data}: PageProps = $props();
</script>

<div class="p-2 pt-4 mx-auto">
    <h1 class="inline-block">Floatplane Search</h1>
    <form action="/search" method="get" class="inline-block ml-4">
        <InputGroup.Root>
            <InputGroup.Input type="search" name="q" placeholder="Search across floatplane..." value={query && query === "*" ? "" : query} />
            <InputGroup.Addon>
                <SearchIcon />
            </InputGroup.Addon>
        </InputGroup.Root>
    </form>
    <br>
    <br>

    <div class="text-center">
        {#each data.hits as result}
            <VideoResult {result} />
        {/each}
    </div>
</div>