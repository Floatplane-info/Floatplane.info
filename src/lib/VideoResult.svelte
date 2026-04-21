<script lang="ts">
    import type {FloatplanePost} from "../routes/search/types.ts";
    import type {SearchResponseHit} from "typesense";
    import sanitizeHtml from "sanitize-html";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import DateStamp from "$lib/DateStamp.svelte";

    let {
        result,
    }: {
        result: SearchResponseHit<FloatplanePost>,
    } = $props();
</script>

<a class="inline-block w-96 p-1 m-1 mb-4 text-left align-top" href="https://www.floatplane.com/post/{result.document.id}">
    <img class="w-full aspect-video" src={result.document.thumbnail?.path} alt="" aria-hidden="true" loading="lazy">
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
        <div class="text-xs opacity-80 line-clamp-1 result-highlight -mt-1.5">
            {@html sanitizeHtml(result.highlight.text?.snippet ?? result.highlight.textMarkdown?.snippet ?? result.document.text, {allowedTags: ["mark"]})}
        </div>
        <div class="text-xs opacity-80 mt-0.5">
            <img
                    src={result.document.channel.icon.path}
                    aria-hidden="true" alt=""
                    class="h-7 w-7 inline-block rounded-full self-center"
                    loading="lazy"
            >
            {result.document.channel.title}
            <span class="ml-4 opacity-80">
                <DateStamp epochSeconds={new Date(result.document.releaseDate).getTime() / 1000}/>
            </span>
        </div>
    </div>
</a>

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
