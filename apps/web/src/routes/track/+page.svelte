<script lang="ts">
    import { goto } from '$app/navigation';
    import { lrclib, type Track as LrcTrack } from 'lrclib';
    import { onMount } from 'svelte';
    import { queryParam } from 'sveltekit-search-params';
    import ViewLyrics from '$lib/components/ViewLyrics.svelte';
    import ViewLyricsSkeleton from '../../lib/components/ViewLyricsSkeleton.svelte';

    let id = queryParam('id');
    let track: LrcTrack|null = null;

    onMount(async () => {
        if (!$id) return goto('/');

        track = await lrclib.fetchId($id).catch(e => null);
        if (!track) return goto('/');
    });
</script>

<div class="container max-w-3xl p-4">
    {#if track}
        <ViewLyrics {track}/>
    {:else}
        <ViewLyricsSkeleton/>
    {/if}
</div>