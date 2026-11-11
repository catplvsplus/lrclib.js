<script lang="ts">
	import '#lib/styles/layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onDestroy, onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import storage from '#lib/helpers/storage.js';
	import { deepMerge, MetaTags } from 'svelte-meta-tags';
	import { page } from '$app/state';
	import { Player } from '../lib/classes/Player.svelte.js';
	import { playerContext } from '../lib/helpers/contexts.js';

	let { children, data } = $props();

    let metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));

    const player = playerContext.set(new Player());

    onMount(async () => {
        await storage.init();
        await player.init();
    });

    onDestroy(async () => {
        player.destroy();
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
