<script lang="ts">
	import '$lib/styles/app.css';
    import { ModeWatcher } from 'mode-watcher';
    import { Toaster } from '$lib/components/ui/sonner/index';

	let { children } = $props();
</script>

<ModeWatcher/>
<Toaster/>

<svelte:head>
    <title>Lrclib.js</title>
</svelte:head>

{@render children?.()}
