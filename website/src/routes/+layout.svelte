<script lang="ts">
	import '$lib/styles/layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import PersistentStorage from '../lib/classes/Storage.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

    const storage = PersistentStorage.set(new PersistentStorage());

    onMount(async () => {
        await storage.init();
    });
</script>

<ModeWatcher/>
{@render children()}
