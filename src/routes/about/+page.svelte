<script lang="ts">
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
</script>
<svelte:head>
    <title>About Floatplane.Info</title>
</svelte:head>

<Breadcrumb.Root class="p-2 pl-3">
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Floatplane.Info</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Page>About</Breadcrumb.Page>
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

<div class="limit mx-auto mb-32">
    <h1>About</h1>
    <p>
        This site was made by <a class="a" href="https://about.ajg0702.us/">ajgeiss0702</a>.
        I made this site because of how bad floatplane's built-in search is, and has been for years.
    </p>
    <p>
        When I subscribed to joined Floatplane, the search seem to just not match things very well.
        When searching for something specific, it would come up, but often be way further down the search results than it should be.
    </p>
    <p>
        Then at some point it got worse. A lot of videos wouldn't show up in Floatplane's search at all, no matter what you search.
        For example, searching for "WAN Show" would only bring up videos that had nothing to do with the WAN Show.
        This seems to be mostly fixed now (now the main issue seems to be relevancy sorting) but was an issue for months.
    </p>
    <hr>
    <h2>The final push for me to make this site</h2>
    <p>
        I had been thinking of making this site for a while. The thing that finally pushed me to make it was when I was
        watching a livestream, and the host was trying to find a specific video on floatplane
        (a stream VOD: <a class="a" href="https://www.floatplane.com/post/B7bYBpDgLg">"I feel so disrespected right now"</a>).
    </p>
    <p>
        The host first tried searching "desk stream" (since it was a stream about a desk) and scrolled for a minute or two and couldn't find it.
    </p>
    <p>
        So, he then searched for it on youtube, and found the exact title. But the moment he was looking for was in the pre-show so he needed the Floatplane VOD.
    </p>
    <p>
        He went back to floatplane and searched "I feel so" (a direct part of the title) and scrolled for a minute or two and it still did not come up.
    </p>
    <p>
        To find the moment, he ended up needing to remove the search and scroll all the way back to 2023 (when the stream was from) to find it.
    </p>
    <br>
    <p>
        He did end up finding it, but it took several minutes of failed searches and scrolling, and he was very frustrated at the end.
    </p>
    <p>
        Compared to Floatplane's built-in search, searching for the vague phrase "desk stream" on Floatplane.Info
        brings up the correct VOD at #14 (or #9 if you filter to just LinusTechTips posts).
    </p>
    <p>
        Searching for "I feel so" on Floatplane.Info comes up with the VOD we're looking for at #2.
    </p>
    <hr>
    <h2>Floatplane people!</h2>
    <p>
        The basics of this site (indexing + basic search) was made in a few hours.
    </p>
    <p>
        Please, Floatplane, fix your search. It's been actually unusable for so many years
        and there are many off-the-shelf and free solutions available that could probably be integrated fairly easily.
        They might not be perfect but they would at least be usable.
    </p>
    <p>
        Floatplane peeps, if you're reading this, i'd be very willing to walk you though (or more)
        how I implemented this search, which can be run fully-self-hosted for free.
    </p>
    <p>
        The search software I use doesn't require much. The search index for this site is literally running on an old school laptop
        (just the motherboard, I got it for free and host several things on it), it really does not take much to run.
    </p>
    <p>
        I'm very willing to help y'all (at Floatplane) build a better search.
        It could be even faster than Floatplane.Info's search if you're ok with just a better/usable search.<br>
        I wouldn't even charge anything for doing this, I just want it to not be usable.<br>
        If you (Floatplane) are interested in this, please
        <a class="a" href="https://about.ajg0702.us/contact">reach out</a>.
    </p>
    <p>
        All of the source code is also linked below, so feel free to explore that.
        But also note there are faster/easier things you can do than what I did to get better search.
        I just wanted mine to be really good, so I did a bunch of things
        (like hybrid search with embeddings) to make it better but also slower.
    </p>
    <hr>
    <h2>Source Code</h2>
    <p>
        <b>All</b> of the source code for this site is posted publicly on the
        <a class="a" href="https://github.com/Floatplane-info/">GitHub Org</a>.
    </p>
    <p>
        The <a class="a" href="https://github.com/Floatplane-info/Floatplane.info">Floatplane.Info repo</a>
        has the code for the frontend (this site), and the
        <a class="a" href="https://github.com/Floatplane-info/sync">Sync repo</a>
        has the code for the background syncing/indexing processes.
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