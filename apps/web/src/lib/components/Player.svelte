<script lang="ts">
    import type { Track } from 'lrclib';
    import { parseBlob, type IAudioMetadata } from 'music-metadata';
    import { onMount } from 'svelte';
    import PlayerProgress from './PlayerProgress.svelte';
    import PlayerControls from './PlayerControls.svelte';
    import { cn, getCurrentTimeLineIndex } from '../helpers/utils';
    import PlayerLyrics from './PlayerLyrics.svelte';

    export let track: Track;
    export let blob: Blob;
    export let audio: string;

    let data: IAudioMetadata|null = null;
    let albumCover: string = '/images/album.png';

    let duration: number;
    let currentTime: number;
    let paused: boolean;
    let loop: boolean = false;
    let muted: boolean = false;
    let currentTimeLineIndex: number|undefined = undefined;

    onMount(async () => {
        data = await parseBlob(blob);

        const imageData = data?.common?.picture?.[0];
        albumCover = imageData
            ? URL.createObjectURL(new Blob([imageData.data], {
                type: imageData.format
            }))
            : '/images/album.png';
    });

    $: currentTime, currentTimeLineIndex = getCurrentTimeLineIndex(currentTime, track.syncedLyricsJSON);
</script>

<audio src={audio} bind:duration bind:currentTime bind:paused {loop} {muted} autoplay></audio>
<div class="h-full w-full relative overflow-hidden">
    <div class="h-full w-full top-0 left-0 absolute">
        <img src={albumCover} alt="" class="absolute h-full w-full">
        <img src={albumCover} alt="" class="animate-spin absolute h-screen top-0 left-0" style="animation-duration: 20s;">
        <img src={albumCover} alt="" class="animate-spin absolute h-screen bottom-0 right-0" style="animation-duration: 20s;">
        <img src={albumCover} alt="" class="animate-spin absolute h-screen top-1/2 left-1/2 bottom-0 " style="animation-duration: 20s;">
    </div>
    <div class="h-full w-full top-0 left-0 absolute backdrop-blur-[10vh] dark:backdrop-saturate-150 bg-black/60 pt-14 flex justify-center items-center gap-16">
        <div class="flex flex-col gap-4 shrink-0 w-1/4 items-center">
            <div class="rounded-md overflow-hidden h-96 w-96 relative">
                <img src={albumCover} alt="" class="h-full w-full">
            </div>
            <div class="flex flex-col text-center max-w-96 w-full">
                <h1 class="text-3xl text-white font-bold max-w-96 whitespace-nowrap overflow-hidden">{data?.common.title || track.trackName}</h1>
                <p class="text-muted-foreground max-w-96 whitespace-nowrap overflow-hidden">{data?.common.artists || track.artistName}</p>
            </div>
            <div class="flex flex-col gap-2 max-w-96 w-full">
                <PlayerProgress bind:duration bind:currentTime/>
                <div class="flex justify-center">
                    <PlayerControls bind:loop bind:paused bind:muted class="mb-4"/>
                </div>
            </div>
        </div>
        <div class="h-full w-1/2">
            <PlayerLyrics bind:track bind:currentTime bind:currentTimeLineIndex/>
        </div>
    </div>
</div>