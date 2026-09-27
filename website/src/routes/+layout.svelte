<script lang="ts">
	import '$lib/styles/layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import PersistentStorage from '../lib/classes/Storage.svelte';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

    const storage = PersistentStorage.set(new PersistentStorage());

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

<ModeWatcher/>
{@render children()}
