<script lang="ts">
    import type {FloatplanePost} from "../routes/search/types.ts";
    import type {SearchResponseHit} from "typesense";
    import sanitizeHtml from "sanitize-html";
    import * as Tooltip from "$lib/components/ui/tooltip";

    let {
        result
    }: {
        result: SearchResponseHit<FloatplanePost>
    } = $props();
</script>

<a class="inline-block w-96 p-1 m-1 text-left" href="https://www.floatplane.com/post/{result.document.id}">
    <img class="w-full aspect-video" src={result.document.thumbnail.path} alt="" aria-hidden="true">
    <div class="px-1">
        <Tooltip.Root>
            <Tooltip.Trigger>
                <div class="line-clamp-2 text-left cursor-pointer" title={result.document.title}>
                    {@html sanitizeHtml(result.highlight.title?.snippet ?? result.document.title, {allowedTags: ["mark"]})}
                </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>
                    {@html sanitizeHtml(result.highlight.title?.snippet ?? result.document.title, {allowedTags: ["mark"]})}
                </p>
            </Tooltip.Content>
        </Tooltip.Root>
        <div class="text-xs opacity-80 line-clamp-1">
            {@html sanitizeHtml(result.highlight.text?.snippet ?? result.highlight.textMarkdown?.snippet ?? result.document.text, {allowedTags: ["mark"]})}
        </div>
    </div>
</a>
