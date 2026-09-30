<script lang="ts">
	import '$lib/styles/layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import storage from '$lib/helpers/storage';
	import { deepMerge, MetaTags } from 'svelte-meta-tags';
	import { page } from '$app/state';

	let { children, data } = $props();

    let metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));

    onMount(async () => {
        await storage.init();
    });

    onNavigate(navigation => {
        if (!document.startViewTransition) return;

        return new Promise(resolve => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            })
        });
    });
</script>

<style>
    :root {
        view-transition-name: none;
    }

    /* :global(html),
    :global(body) {
        overscroll-behavior: none;
    } */
</style>

<MetaTags {...metaTags}/>
<ModeWatcher/>
{@render children()}
