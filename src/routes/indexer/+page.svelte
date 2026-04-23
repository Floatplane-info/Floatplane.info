<script lang="ts">
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
</script>
<svelte:head>
    <title>Indexer - Floatplane.Info</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Breadcrumb.Root class="p-2 pl-3">
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Floatplane.Info</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Page>Indexer</Breadcrumb.Page>
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

<div class="limit mx-auto pt-8">
    <h1>Indexer User-Agent</h1>
    You were probably linked to this page from Floatplane.Info's Indexer bot's User-Agent header.<br>
    <br>
    Floatplane.Info needs to scan Floatplane for videos to index for our <a href="/">Search</a>.<br>
    If the Indexer bot is sending too many requests, or sending requests too often, or you just want to learn more,
    please reach out to <a class="a" href="mailto:floatplane-indexer@ajg0702.us">floatplane-indexer@ajg0702.us</a>.<br>
    I would highly appreciate it if you reached out before blocking the bot.
</div>