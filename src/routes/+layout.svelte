<script lang="ts">
	import './layout.css';
    import { ModeWatcher } from "mode-watcher";
	import favicon from '$lib/assets/favicon.svg';
    import * as ToolTip from "$lib/components/ui/tooltip";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
<ToolTip.Provider delayDuration={500}>
    {@render children()}
</ToolTip.Provider>
