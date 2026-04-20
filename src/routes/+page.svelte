<script lang="ts">
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import SearchIcon from "@lucide/svelte/icons/search";
</script>

<div class="limit mx-auto flex items-center justify-center h-screen">
    <div class="w-full text-center">
        <h1 class="text-6xl mb-6">Floatplane Search</h1>

        <form action="/search" method="get" class="">
            <InputGroup.Root>
                <InputGroup.Input class="text-xl" type="search" name="q" placeholder="Search across floatplane..." />
                <InputGroup.Addon>
                    <SearchIcon />
                </InputGroup.Addon>
                <InputGroup.Addon align="inline-end">
                    <InputGroup.Button variant="secondary" class="cursor-pointer">Search</InputGroup.Button>
                </InputGroup.Addon>
            </InputGroup.Root>
        </form>
    </div>
</div>