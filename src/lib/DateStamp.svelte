<script lang="ts">

    import { onMount } from 'svelte';
    import { shortMonths, isSameDay, yesterday } from '$lib/timeUtils';

    import { typed } from '$lib';

    let { epochSeconds = typed<number>() } = $props();

    let nowish = $state(Date.now());
    let secondsAgo: number | undefined = $derived((nowish / 1000) - epochSeconds);

    onMount(() => {
        let i: number;
        if (secondsAgo < 60 * 60) {
            i = setInterval(() => {
                nowish = Date.now();
            }, 15e3) as unknown as number;
        } else if (isSameDay(new Date(), date) || isSameDay(yesterday(), date)) {
            i = setInterval(() => {
                date = date; // tell svelte to re-evaluate isSameDay ifs below
            }, 60e3) as unknown as number;
        }

        return () => clearInterval(i);
    });
    let date = $derived(new Date(epochSeconds * 1000));
    $effect(() => {
        epochSeconds;
        nowish = Date.now();
    })
</script>

<span
        title="{shortMonths[date.getMonth()]} {date.getDate()}, {date.getFullYear()} at {date.toLocaleTimeString(undefined, { timeStyle: 'medium', })}"
>
	{#if secondsAgo < 30}
		a few seconds ago
	{:else if secondsAgo < 60 * 60}
		{Math.round(secondsAgo / 60)} minute{Math.round(secondsAgo / 60) === 1 ? '' : 's'} ago
	{:else if isSameDay(new Date(), date)}
		Today at {date.toLocaleTimeString(undefined, {
        timeStyle: 'short',
    })}
	{:else if isSameDay(yesterday(), date)}
		Yesterday at {date.toLocaleTimeString(undefined, {
        timeStyle: 'short',
    })}
	{:else}
		{shortMonths[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
	{/if}
</span>
