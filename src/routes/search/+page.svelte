<script lang="ts">
    import type { PageProps } from './$types';
    import VideoResult from "$lib/VideoResult.svelte";
    import SearchIcon from "@lucide/svelte/icons/search";
    import * as InputGroup from "$lib/components/ui/input-group";
    import {page} from "$app/state";
    import {Badge} from "$lib/components/ui/badge/index";

    let query = $state(page.url.searchParams.get("q") ?? undefined);


    let {data}: PageProps = $props();
</script>
<!--<pre>{JSON.stringify(data, undefined, '\t')}</pre>-->
<svelte:head>
    <title>{query !== "*" ? `Search results for "${query}"` : "All Indexed Posts"} - Floatplane.Info</title>
</svelte:head>

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
    <div class="mb-4 max-md:text-center max-md:mx-auto md:h-0 md:sticky md:top-2 md:w-60">
        <ul class="inline-block text-left max-md:max-h-96 md:max-h-screen overflow-y-auto md:pb-32">
            {#each data.results.facet_counts?.[0].counts.sort((a, b) => b.count - a.count) as creator (creator.value)}
                {@const channelFacets = data.results.facet_counts?.[1].counts
                    .filter(facet => facet.parent?.creator === creator.value)}
                <li>
                    <a
                            href={(() => {
                                const url = new URL(page.url);
                                if(url.searchParams.get("creator") === creator.value) {
                                    url.searchParams.delete("creator");
                                } else {
                                    url.searchParams.set("creator", creator.value);
                                }
                                return url.toString();
                            })()}
                            class="hover:underline flex"
                    >
                        <img
                                src={creator.parent?.icon.path}
                                aria-hidden="true" alt=""
                                class="h-4 w-4 inline-block rounded-full self-center"
                        >
                        <span class="pl-2 pr-1">
                            {creator.parent?.title}
                        </span>
                        <Badge variant="outline" class="self-center hover:no-underline">
                            {creator.count}
                        </Badge>
                    </a>
                    {#if creator.parent?.channels.length > 1}
                        <ul class="ml-3">
                            {#each channelFacets as channel (channel.value)}
                                <li>
                                    <a
                                            href={(() => {
                                            const url = new URL(page.url);
                                            if(url.searchParams.get("channel") === channel.value) {
                                                url.searchParams.delete("channel")
                                            } else {
                                                url.searchParams.set("channel", channel.value);
                                            }
                                            return url.toString();
                                        })()}
                                            class="hover:underline"
                                    >
                                        <img
                                                src={channel.parent?.icon.path}
                                                aria-hidden="true" alt=""
                                                class="h-4 w-4 inline-block rounded-full"
                                        >
                                        {channel.parent?.title}
                                        <Badge variant="outline">
                                            {channel.count}
                                        </Badge>
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>

    <div class="grid justify-center grid-cols-[repeat(auto-fit,384px)] md:ml-60">
        <div class="block text-right text-xs opacity-60 w-full col-span-full">
            {data.results.found} results found in {Math.round((data.results.search_time_ms + data.embedTime) / 10) / 100}s.
        </div>
        {#each data.results.hits as result (result.document.id)}
            <VideoResult {result} />
        {/each}
    </div>
</div>