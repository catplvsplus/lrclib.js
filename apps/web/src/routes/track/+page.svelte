<script lang="ts">
    import { goto } from '$app/navigation';
    import { lrclib, type Track as LrcTrack } from 'lrclib';
    import { onMount } from 'svelte';
    import { queryParam } from 'sveltekit-search-params';
    import ViewLyrics from '$lib/components/ViewLyrics.svelte';

    let id = queryParam('id');
    let track: LrcTrack|null = null;

    onMount(async () => {
        if (!$id) return goto('/');

        track = await lrclib.fetchId($id).catch(e => null);
        if (!track) return goto('/');
    });
</script>

{#if track}
    <div class="container max-w-3xl p-4">
        <ViewLyrics {track}/>
    </div>
{:else}
    <div class="min-h-80 w-full flex flex-col justify-center items-center">
        <h1 class="text-xl font-medium">Loading...</h1>
    </div>
{/if}