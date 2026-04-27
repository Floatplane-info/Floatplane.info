<script lang="ts">
	import './layout.css';
    import 'nprogress/nprogress.css';


    import { ModeWatcher } from "mode-watcher";
	import favicon from '$lib/images/floatplane-info-196.webp';
    import * as ToolTip from "$lib/components/ui/tooltip";
    import {afterNavigate, beforeNavigate} from "$app/navigation";
    import {navigating} from "$app/state";
    import NProgress from 'nprogress';

	let { children } = $props();

    NProgress.configure({
        minimum: 0.16
    });

    let progressTimeout: number;

    beforeNavigate(n => {
        if (progressTimeout) clearTimeout(progressTimeout);
        progressTimeout = setTimeout(() => {
            if (navigating.type) {
                NProgress.start();
            }
        }, 150) as unknown as number;
    })

    afterNavigate(() => {
        if (progressTimeout) clearTimeout(progressTimeout);
        NProgress.done();
    })
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
<ToolTip.Provider delayDuration={500}>
    {@render children()}
</ToolTip.Provider>
