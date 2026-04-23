<script lang="ts">
    import type {FloatplaneImage} from "../routes/search/types.ts";
    import {fade} from "svelte/transition";

    let props: {
        thumbnail: FloatplaneImage,
        i: number
    } = $props();

    let mainImageLoaded = $state(false);

    const smallestThumbnail = $derived(props.thumbnail.childImages?.reduce((prev, curr) => {
        if(!prev) return curr;
        return curr.width < prev.width ? curr : prev;
    }, undefined));

    const smallestThumbnailDifference = $derived(smallestThumbnail ? props.thumbnail.width - smallestThumbnail.width : smallestThumbnail);

    const showSmallestThumbnail = $derived(
        smallestThumbnail &&
        smallestThumbnailDifference &&
        smallestThumbnail.width <= 400 &&
        smallestThumbnailDifference > 500
    );

</script>

{#if !mainImageLoaded && smallestThumbnail && showSmallestThumbnail}
    <div class="w-full absolute aspect-video rounded-md z-10 overflow-hidden" out:fade={{delay: 500, duration: 1}}>
        <img
                class="w-full aspect-video"
                src={smallestThumbnail.path}
                alt="" aria-hidden="true"
                decoding={props.i > 8 ? "async" : "auto"}
                width={smallestThumbnail.width}
                height={smallestThumbnail.height}
        >
    </div>
{/if}
<img
        class={[
            "w-full relative aspect-video rounded-md transition-opacity duration-500",
            mainImageLoaded ? "z-10" : "z-0",
            showSmallestThumbnail ? (mainImageLoaded ? "opacity-100" : "opacity-0") : "opacity-100",
        ]}
        src={props.thumbnail?.path}
        alt="" aria-hidden="true"
        loading="lazy"
        decoding="async"
        onload={() => mainImageLoaded = true}
        width={props.thumbnail?.width}
        height={props.thumbnail?.height}
>
