<script lang="ts">
    import type { PageProps } from './$types';
    import VideoResult from "$lib/VideoResult.svelte";
    import SearchIcon from "@lucide/svelte/icons/search";
    import * as InputGroup from "$lib/components/ui/input-group";
    import * as NativeSelect from "$lib/components/ui/native-select";
    import {page} from "$app/state";
    import {Badge} from "$lib/components/ui/badge/index";
    import {commas} from "$lib/utils";
    import {Skeleton} from "$lib/components/ui/skeleton";
    import LazyLoad from "@dimfeld/svelte-lazyload";
    import type {SearchApiResponse} from "../api/search/+server.ts";
    import {onMount} from "svelte";

    let form: HTMLFormElement | undefined = $state();

    let {data}: PageProps = $props();

    let mounted = $state(false);
    onMount(() => {
        mounted = true;
    })

    let query = $derived(data.q);
    let sort = $derived(page.url.searchParams.get("sort") ?? "");
    let creator = $derived(page.url.searchParams.get("creator"));
    let channel = $derived(page.url.searchParams.get("channel"));

    let latestPage = 1;
    let laterPages: Promise<SearchApiResponse>[] = $state([]);

    let lastNewPage = 0;
    function newPage() {
        if(!mounted) return;
        if(Date.now() - lastNewPage < 500) return;
        lastNewPage = Date.now();
        const searchUrl = new URL(page.url);
        searchUrl.pathname = "/api/search";
        searchUrl.searchParams.set("page", (++latestPage).toString());
        laterPages.push(
            fetch(searchUrl)
                .then(r => r.json() as Promise<SearchApiResponse>)
        );
    }
</script>
<!--<pre>{JSON.stringify(data, undefined, '\t')}</pre>-->
<svelte:head>
    <title>{query !== "*" ? `Search results for "${query}"` : "All Indexed Posts"} - Floatplane.Info</title>
</svelte:head>

<div class="p-2 pt-4 mx-auto">
    <a href="/">
        <h1 class="inline-block pl-1">Floatplane Search</h1>
    </a>
    <form action="/search" method="get" class="inline-block ml-4" bind:this={form}>
        <div class="inline-block">
            <InputGroup.Root>
                <InputGroup.Input
                        type="search"
                        name="q"
                        placeholder="Search across floatplane..."
                        value={query && query === "*" ? "" : query}
                />
                <InputGroup.Addon>
                    <SearchIcon />
                </InputGroup.Addon>
            </InputGroup.Root>
        </div>
        <NativeSelect.Root name="sort" class="inline-block ml-2 align-top" onchange={() => form?.requestSubmit()} value={sort}>
            <NativeSelect.Option value="">
                {#if query !== "*"}
                    Default – Relevance & Upload Date (newest)
                {:else}
                    Upload Date (newest)
                {/if}
            </NativeSelect.Option>
            {#if query !== "*"}
                <NativeSelect.Option value="relevant">Relevance Only</NativeSelect.Option>
                <NativeSelect.Option value="newest">Upload Date (newest)</NativeSelect.Option>
            {/if}
            <NativeSelect.Option value="oldest">Upload Date (oldest)</NativeSelect.Option>
        </NativeSelect.Root>
        <input type="hidden" name="creator" value={creator}>
        <input type="hidden" name="channel" value={channel}>
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
                            class={[
                                "hover:underline flex rounded-md px-1",
                                page.url.searchParams.get("creator")?.includes(creator.value) && "bg-red-500/20"
                            ]}
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
                                            class={[
                                                "hover:underline flex rounded-md px-0.5",
                                                page.url.searchParams.get("channel")?.includes(channel.value) && "bg-red-500/20"
                                            ]}
                                    >
                                        <img
                                                src={channel.parent?.icon.path}
                                                aria-hidden="true" alt=""
                                                class="h-4 w-4 inline-block rounded-full self-center"
                                        >
                                        <span class="pl-2 pr-1">
                                            {channel.parent?.title}
                                        </span>
                                        <Badge variant="outline" class="self-center hover:no-underline">
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

    <div class="grid justify-center grid-cols-[repeat(auto-fit,384px)] md:ml-60 mb-96">
        <div class="block text-right text-xs opacity-60 w-full col-span-full">
            {commas(data.results.found)} results found in {Math.round((data.results.search_time_ms + data.embedTime) / 10) / 100}s.
        </div>
        {#each data.results.hits as result, i (result.document.id)}
            <VideoResult {result} {i}/>
        {/each}
        {#snippet VideoResultSkeleton()}
            <div class="inline-block w-96 p-1 m-1 mb-4 text-left align-top">
                <Skeleton class="w-full aspect-video rounded-md" />
                <div class="px-1">
                    <Skeleton class="w-full h-4.5 my-1" />
                    <Skeleton class="w-full h-4.5 my-1" />
                    <Skeleton class="w-full opacity-80 h-3.5 mt-3 mb-2" />
                </div>
                <div class="mt-0.5 px-1.5">
                    <Skeleton class="h-7 w-7 inline-block rounded-full align-top mr-1"/>
                    <Skeleton class="h-3.5 w-30 inline-block align-middle"/>
                    <Skeleton class="h-3.5 w-20 inline-block opacity-80 ml-4 align-middle"/>
                </div>
            </div>
        {/snippet}
        {#each laterPages as pageP, i (i)}
            {#await pageP}
                {@const remaining = Math.min(data.results.found - ((i+1) * data.per_page), 100)}
                {#each Array(remaining) as _}
                    {@render VideoResultSkeleton()}
                {/each}
            {:then page}
                {#each page.results.hits as result, i (result.document.id)}
                    <VideoResult {result} i={i + ((page.page-1) * page.per_page)}/>
                {/each}
            {/await}
        {/each}
        {#if data.results.found > data.per_page * (1 + laterPages.length)}
            {@const remaining = Math.min(100, data.results.found - (data.per_page * (1 + laterPages.length)))}
            {#if mounted}
                {#key laterPages.length}
                    <LazyLoad on:visible={newPage}/>
                {/key}
            {/if}
            {#each Array(remaining) as _, i (i)}
                {@render VideoResultSkeleton()}
            {/each}
        {/if}
    </div>
</div>