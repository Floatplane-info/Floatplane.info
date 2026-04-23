<script lang="ts">
    import type {FloatplanePost} from "../routes/search/types.ts";
    import type {SearchResponseHit} from "typesense";
    import sanitizeHtml from "sanitize-html";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import DateStamp from "$lib/DateStamp.svelte";
    import {addZero} from "$lib/utils";
    import {dev} from "$app/environment";
    import FloatplaneThumbnail from "$lib/FloatplaneThumbnail.svelte";

    let {
        result,
        i
    }: {
        result: SearchResponseHit<FloatplanePost>,
        i: number
    } = $props();

    let postLink = $derived(`https://www.floatplane.com/post/${result.document.id}`);
    let channelLink = $derived(`https://www.floatplane.com/channel/${result.document.creator.urlname}/home/${result.document.channel.urlname}`);
</script>

<div class="inline-block w-96 p-1 m-1 mb-4 text-left align-top">
    <a href={postLink}>
        <div class="w-full aspect-video relative">
            {#if dev}
                <div class="absolute top-1 left-1 z-50">
                    #{i+1}
                </div>
            {/if}
            <FloatplaneThumbnail thumbnail={result.document.thumbnail} {i}/>
            {#if typeof result.document.metadata.displayDuration === "number"}
                {@const displayDuration = result.document.metadata.displayDuration}
                {@const hours = Math.floor(displayDuration / (60 * 60))}
                {@const minutes = Math.floor((displayDuration % (60 * 60)) / 60)}
                {@const seconds = Math.floor(displayDuration % 60)}
                <div class="absolute bottom-1 right-1 z-20 bg-black/50 rounded-sm px-1 text-xs">
                    <div class="flex">
                        {#if hours > 0}
                            <span>{hours}:</span>
                        {/if}
                        <span>{addZero(minutes)}:</span>
                        <span>{addZero(seconds)}</span>
                    </div>
                </div>
            {/if}
        </div>
        <div class="px-1">
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <div class="line-clamp-2 text-left cursor-pointer result-highlight" title={result.document.title}>
                        {@html sanitizeHtml(result.highlight.title?.snippet ?? result.document.title, {allowedTags: ["mark"]})}
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p class="result-highlight">
                        {@html sanitizeHtml(result.highlight.title?.snippet ?? result.document.title, {allowedTags: ["mark"]})}
                    </p>
                </Tooltip.Content>
            </Tooltip.Root>
            <br>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <div class="text-xs opacity-80 line-clamp-1 result-highlight -mt-1.5 text-left">
                        {@html sanitizeHtml(result.highlight.text?.snippet ?? result.highlight.textMarkdown?.snippet ?? result.document.text, {allowedTags: ["mark"]})}
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p class="result-highlight">
                        {@html sanitizeHtml(result.highlight.text?.snippet ?? result.highlight.textMarkdown?.snippet ?? result.document.text, {allowedTags: ["mark"]})}
                    </p>
                </Tooltip.Content>
            </Tooltip.Root>
        </div>
    </a>
    <div class="text-xs opacity-80 mt-0.5 px-1.5">
        <a href={channelLink}>
            <img
                    src={result.document.channel.icon.path}
                    aria-hidden="true" alt=""
                    class="h-7 w-7 inline-block rounded-full self-center mr-1"
                    loading="lazy"
            >
            {result.document.channel.title}
        </a>
        <span class="ml-4 opacity-80">
            <DateStamp epochSeconds={new Date(result.document.releaseDate).getTime() / 1000}/>
            {#if dev}
                &nbsp;
                <!--{result.hybrid_search_info.rank_fusion_score}-->
            {/if}
        </span>
    </div>
</div>

<style>
    @reference "#layout.css";
    .result-highlight :global(mark) {
        /*background-color: rgb(var(--color-primary-500) / 0.4);*/
        background-color: inherit;
        font-weight: bold;
        @apply brightness-200;
        color: var(--color-cyan-900);
    }
    :global(.dark) .result-highlight :global(mark) {
        color: var(--color-cyan-400);
    }
</style>
