<script lang="ts">
    import type { PageProps } from './$types';
    import VideoResult from "$lib/VideoResult.svelte";


    let {data}: PageProps = $props();
</script>

<div class="p-2 mx-auto">
    <h1>Search Results</h1>
    <div class="text-center">
        {#each data.hits as result}
            <VideoResult {result} />
        {/each}
    </div>
</div>