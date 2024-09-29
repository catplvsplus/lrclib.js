<script lang="ts">
    import { goto } from '$app/navigation';
    import { lrclib, type Track as LrcTrack } from 'lrclib';
    import { onMount } from 'svelte';
    import { queryParam } from 'sveltekit-search-params';
    import ViewLyrics from '$lib/components/ViewLyrics.svelte';
    import ViewLyricsSkeleton from '$lib/components/ViewLyricsSkeleton.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    let id = queryParam('id');
    let track: LrcTrack|null = null;

    onMount(async () => {
        if (!$id) return goto('/');

        track = await lrclib.fetchId($id).catch(e => null);
        if (!track) return goto('/');
    });
</script>

<svelte:head>
    <title>{track?.trackName ? `Lrclib.js | ${track.trackName}` : 'Lrclib.js'}</title>
</svelte:head>

<MetaTags title="Lrclib.js | {track?.trackName ?? 'Track'}" description="View synced lyrics from Lrclib.js"/>

<div class="container max-w-3xl p-4">
    {#if track}
        <ViewLyrics {track}/>
    {:else}
        <ViewLyricsSkeleton/>
    {/if}
</div>