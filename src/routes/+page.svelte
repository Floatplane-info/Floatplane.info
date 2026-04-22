<script lang="ts">
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import SearchIcon from "@lucide/svelte/icons/search";
</script>
<svelte:head>
    <title>Better Floatplane Search - Floatplane.Info</title>
</svelte:head>

<div class="limit mx-auto flex items-center justify-center h-screen">
    <div class="w-full text-center">
        <h1 class="text-6xl mb-6">Floatplane Search</h1>

        <form action="/search" method="get" class="">
            <InputGroup.Root>
                <InputGroup.Input type="search" name="q" placeholder="Search across floatplane..." />
                <InputGroup.Addon>
                    <SearchIcon />
                </InputGroup.Addon>
                <InputGroup.Addon align="inline-end">
                    <InputGroup.Button variant="secondary" class="cursor-pointer">Search</InputGroup.Button>
                </InputGroup.Addon>
            </InputGroup.Root>
        </form>
        <br>
        This site is still <b>very</b> WIP, but i hope to polish it up over the next few days/weeks.
    </div>
</div>