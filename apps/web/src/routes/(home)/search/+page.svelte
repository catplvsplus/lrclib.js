<script lang="ts">
    import { lrclib, Track as LrcTrack } from 'lrclib.js';
    import { search } from '$lib/stores/search';
    import Track from '$lib/components/Track.svelte';
    import Search from 'lucide-svelte/icons/search';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import LyricsModal from '$lib/components/LyricsModal.svelte';
    import TrackSkeleton from '$lib/components/TrackSkeleton.svelte';

    let results: Promise<LrcTrack[]> = Promise.resolve([]);
    let throttle: NodeJS.Timeout|null = null;

    function searchTracks(search: string, throttled = false) {
        if (throttle) clearTimeout(throttle);

        throttle = setTimeout(async () => {
            results = search.trim() ? lrclib.search(search) : Promise.resolve([]);
            if (throttle) clearTimeout(throttle);
        }, throttled ? 500 : 0);
    }

    onMount(async () => {
        if (!($search ?? '')) goto('/');
        searchTracks($search ?? '');
    });

    $: $search, (() => searchTracks($search ?? ''))();
</script>

<div class="container max-w-3xl p-4">
    {#if $search?.trim()}
        <div class="flex items-center mb-4 gap-2 text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
            <Search font-weight="bolder" class="shrink-0 text-primary"/>
            <span class="font-medium">{$search}</span>
        </div>
    {/if}

    {#await results}
        <div class="flex flex-col gap-2">
            <TrackSkeleton  class="h-24 w-full"/>
            <TrackSkeleton class="h-24 w-full"/>
            <TrackSkeleton class="h-24 w-full"/>
            <TrackSkeleton class="h-24 w-full"/>
            <TrackSkeleton class="h-24 w-full"/>
            <TrackSkeleton class="h-24 w-full"/>
        </div>
    {:then tracks}
        {#if tracks.length}
            <div class="flex flex-col gap-2">
                {#each (tracks ?? []) as track}
                    <Track {track}/>
                {/each}
            </div>
        {:else}
            <div class="min-h-80 w-full flex flex-col justify-center items-center">
                <h1 class="text-xl font-medium">No results</h1>
                <p class="text-muted-foreground">Try searching for another key word</p>
            </div>
        {/if}
    {:catch error}
        <div class="min-h-80 w-full flex flex-col justify-center items-center">
            <h1 class="text-xl font-medium">{error.name}</h1>
            <p class="text-muted-foreground">{error.message}</p>
        </div>
    {/await}
</div>

{#if $page.state.showLyrics}
    <LyricsModal trackId={$page.state.showLyrics} open/>
{/if}