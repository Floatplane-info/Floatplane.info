<script lang="ts">
    import type { PageProps } from './$types';
    import VideoResult from "$lib/VideoResult.svelte";
    import SearchIcon from "@lucide/svelte/icons/search";
    import * as InputGroup from "$lib/components/ui/input-group";
    import {page} from "$app/state";
    import {onMount} from "svelte";
    import {invalidateAll} from "$app/navigation";

    let query = $state(page.url.searchParams.get("q") ?? undefined);

    onMount(() => {
        let i;

        if(query === "*" && page.url.searchParams.get("sort") === "oldest") {
            // when listing all and sorting by oldest, invalidate every minute
            i = setInterval(() => {
                invalidateAll();
            }, 60e3)
        }

        return () => clearInterval(i);
    })


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
        {#each data.hits as result (result.document.id)}
            <VideoResult {result} />
        {/each}
    </div>
</div>