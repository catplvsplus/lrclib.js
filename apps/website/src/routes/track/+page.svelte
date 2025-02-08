<script lang="ts">
    import { page } from '$app/state';
    import NavBar from "$lib/components/shared/NavBar.svelte";
    import { lrclib, type Track } from 'lrclib';
    import { onMount } from 'svelte';
    import { queryParam, ssp } from 'sveltekit-search-params';
    import LyricsTextView from '$lib/components/shared/LyricsTextView.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Skeleton } from '$lib/components/ui/skeleton';
    import { X } from 'lucide-svelte';
    import SearchBox from '$lib/components/shared/SearchBox.svelte';
    import { error } from '@sveltejs/kit';

    let track: Promise<Track>|null = $state(null);
    let id = queryParam('id', ssp.number());

    $effect(() => {
        if (id) fetchTrack();
    })

    function fetchTrack() {
        if (!$id) error(404, 'No track ID provided');
        track = lrclib.fetchTrackById($id);
    }
</script>
<NavBar/>

<div class="h-full w-full pt-16 flex justify-center">
    <div class="w-full h-full max-w-screen-md p-5">
        {#if track}
            {#await track}
                <div class="flex flex-col mb-4 gap-2">
                    <Skeleton class="h-4 w-1/2"/>
                    <Skeleton class="h-3 w-1/3"/>
                    <div class="flex gap-1">
                        <Skeleton class="h-4 w-16"/>
                        <Skeleton class="h-4 w-16"/>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex gap-2">
                        <Skeleton class="h-10 sm:w-44 w-full"/>
                        <Skeleton class="h-10 w-44"/>
                    </div>
                    <Skeleton class="h-96 w-full"/>
                </div>
            {:then track}
                <div class="flex flex-col h-full">
                    <div class="flex flex-col mb-4">
                        <h1 class="text-lg font-semibold text-primary leading-5">{track.trackName}</h1>
                        <p class="items-center text-muted-foreground leading-5 text-sm text-ellipsis overflow-hidden">
                            <span title="{track.artistName}">{track.artistName}</span>
                            <span class="inline-block mx-0.5">•</span>
                            <span title="{track.albumName}">{track.albumName}</span>
                        </p>
                        <div class="flex flex-wrap gap-1 pt-2">
                            {#if track.isSynced()}
                                <Badge variant="outline" class="bg-green-600/10 border-current text-green-600">Synced</Badge>
                            {:else}
                                <Badge variant="outline">Unsynced</Badge>
                            {/if}
                            {#if track.isInstrumental()}
                                <Badge variant="outline">Instrumental</Badge>
                            {/if}
                        </div>
                    </div>
                    <LyricsTextView {track} class="h-[calc(100%-5rem)] min-h-60"/>
                </div>
            {:catch error}
                <div class="h-full w-full flex justify-center items-center">
                    <div class="flex flex-col gap-2 items-center">
                        <X class="h-20 w-20 text-primary mb-1"/>
                        <p class="text-muted-foreground text-center">{error.message}</p>
                        <SearchBox class="max-w-96 mt-4"/>
                    </div>
                </div>
            {/await}
        {/if}
    </div>
</div>