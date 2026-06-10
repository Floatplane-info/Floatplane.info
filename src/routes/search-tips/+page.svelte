<script lang="ts">
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
</script>
<svelte:head>
    <title>Search Tips - Floatplane.Info</title>
</svelte:head>

<Breadcrumb.Root class="p-2 pl-3">
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Floatplane.Info</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Page>Search Tips</Breadcrumb.Page>
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

<div class="limit mx-auto mb-32">
    <h1>Search Tips</h1>
    <p>
        <b>You <span class="underline">do not</span> need to know this information for finding 99% of posts!</b>
        I have tuned the default search settings so you can search for things that are vaguely like what you are looking for,
        and you should be able to find it in the first few results (unless there are many very similar results).
    </p>
    <p>
        However, if you want to go beyond, you can learn more about how search works so you can find things even easier, you can.
    </p>
    <hr>
    <h2>Filter to the creator or channel</h2>
    <p>
        By default, search results show results from all creators and channels on Floatplane.
    </p>
    <p>
        Since you probably know which creator and channel (aka sub-channel) the thing you are looking for is on,
        you can filter the results to only that creator/channel by clicking it in the left sidebar (or above the results on mobile).
    </p>
    <p>
        You might need to scroll to see all creators/channels.
    </p>
    <hr>
    <h2>Add more context</h2>
    <p>
        If you are having difficulty finding something, even after filtering to just the creator/channel,
        is to add all the context you can think of to the search query.
    </p>
    <p>
        Floatplane.Info uses Semantic Search, so if you want your searches can be a long description and it will
        be able to find a short title that is basically what you were looking for.
        Your search can also use completely different words that mean basically the same thing as the title or description,
        and it should be able to find it.
    </p>
    <p>
        That being said, exact keyword matches still matter, so if you can remember exact words
        used in the title/description, those will help even though they are not strictly required.
    </p>
    <hr>
    <h2>Negation/exclude words</h2>
    <p>
        If too many results with a certain word are showing up in the results,
        you can use the <code>-</code> operator before a word to exclude that word from results.
    </p>
    <p>
        For example if you want to look for videos about the WAN Show, but don't want actual WAN Show VODs,
        you can search for "<a class="a" href="/search?q=wan+show+-VOD&sort=&creator=&channel="><code>wan show -VOD</code></a>"
        which excludes results that include <code>VOD</code> in the title (or description).
    </p>
    <hr>
    <h2>Let me know about any issues</h2>
    <p>
        If you have trouble finding something, with or without using these tricks, please
        <a class="a" href="https://about.ajg0702.us/contact">let me know</a>!
    </p>
</div>
<style>
    @reference "../layout.css";
    p {
        @apply py-1;
    }
    hr {
        @apply my-4;
    }
</style>