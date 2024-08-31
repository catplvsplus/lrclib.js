<script lang="ts">
    import type { Track } from 'lrclib';
    import { parseBlob, selectCover, type IAudioMetadata } from 'music-metadata';
    import { onDestroy, onMount } from 'svelte';
    import PlayerProgress from './PlayerProgress.svelte';
    import PlayerControls from './PlayerControls.svelte';
    import { cn, getCurrentTimeLineIndex } from '../helpers/utils';
    import PlayerLyrics from './PlayerLyrics.svelte';
    import { FastAverageColor, type FastAverageColorResult } from 'fast-average-color';
    import { enableBlur } from '../stores/enableBlur';

    export let track: Track;
    export let name: string;
    export let blob: Blob;
    export let audio: string;

    let data: IAudioMetadata|null = null;
    let albumCover: string = '/images/album.png';

    let duration: number;
    let currentTime: number;
    let paused: boolean;
    let muted: boolean = false;
    let currentTimeLineIndex: number|undefined = undefined;

    let albumCoverElement: HTMLImageElement;
    let primaryColor: FastAverageColorResult|undefined = undefined;

    onMount(async () => {
        data = await parseBlob(blob);

        const imageData = data?.common?.picture?.[0] ? selectCover(data.common.picture) : null;

        albumCover = imageData
            ? URL.createObjectURL(new Blob([imageData.data], {
                type: imageData.format
            }))
            : '/images/album.png';

        const fac = new FastAverageColor();
        primaryColor = await fac.getColorAsync(albumCover).catch(() => undefined);
    });

    onDestroy(() => albumCover ? URL.revokeObjectURL(albumCover) : null);

    $: currentTime, currentTimeLineIndex = getCurrentTimeLineIndex(currentTime, track.syncedLyricsJSON);
</script>

<audio src={audio} bind:duration bind:currentTime bind:paused {muted} autoplay></audio>
<img src={albumCover} class="fixed -top-full -left-full" bind:this={albumCoverElement}>
<div
    class="w-full h-full flex justify-center items-center relative"
    style={!$enableBlur && primaryColor ? `background: ${primaryColor.hex}` : ''}
>
    <div class="h-full w-full relative overflow-hidden max-w-[2300px]">
        {#if $enableBlur}
            <div class="h-full w-full top-0 left-0 absolute overflow-hidden">
                <img src={albumCover} alt="" class="absolute h-full w-full">
                <img src={albumCover} alt="" class="animate-spin rounded-full absolute h-screen top-0 left-0" style="animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
                <img src={albumCover} alt="" class="animate-spin rounded-full absolute h-screen bottom-0 right-0" style="animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
                <img src={albumCover} alt="" class="animate-spin rounded-full absolute h-screen top-1/2 left-1/2 bottom-0 " style="animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
            </div>
        {/if}
        <div class={cn(
            "content h-full w-full top-0 left-0 absolute dark:backdrop-saturate-150 bg-black/60 pt-14 flex justify-center items-center gap-16",
            $enableBlur ? 'backdrop-blur-[10vh]' : ''
        )}>
            <div class="player flex flex-col gap-4 shrink-0 w-1/3 items-center">
                <div class="cover rounded-md overflow-hidden h-96 w-96 relative">
                    <img src={albumCover} alt="" class="h-full w-full">
                </div>
                <div class="details flex flex-col text-center max-w-96 w-full">
                    <h1 class="text-3xl text-white font-bold max-w-96 whitespace-nowrap overflow-hidden">{data?.common.title || track.trackName}</h1>
                    <p class="text-muted-foreground max-w-96 whitespace-nowrap overflow-hidden">{data?.common.artists || track.artistName}</p>
                </div>
                <div class="controls flex flex-col gap-2 max-w-96 w-full">
                    <PlayerProgress bind:duration bind:currentTime class="progress"/>
                    <div class="buttons flex justify-center">
                        <PlayerControls bind:paused bind:muted bind:blob bind:track bind:name class="mb-4"/>
                    </div>
                </div>
            </div>
            <div class="lyrics h-full w-1/2">
                <PlayerLyrics bind:track bind:currentTime bind:currentTimeLineIndex bind:allowBlur={$enableBlur}/>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @media (max-width: 1050px) {
        .content {
            flex-direction: column;
            padding-top: 0;

            .lyrics {
                width: 100%;
                height: calc(100% - 7rem);
                padding: 0 2rem;
                max-width: 800px;
                margin-bottom: 7rem;

                @media (max-width: 500px) {
                    padding: 0;
                }
            }

            .player {
                position: absolute;
                bottom: 0;
                left: 50%;
                width: calc(100% - 1rem);
                height: calc(7rem - 1rem);
                max-width: 700px;
                padding: 0 2rem;
                margin-bottom: .5rem;
                transform: translate(-50%, 0);
                overflow: hidden;
                flex-direction: row;

                @apply rounded-lg z-20 justify-center items-center;

                .cover {
                    display: none;
                }

                .details {
                    text-align: start;
                    width: 100%;

                    h1 {
                        font-size: 1.5rem;
                    }

                    h1,
                    p {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    @media (max-width: 660px) {
                        display: none;
                    }
                }

                .controls {
                    display: flex;
                    align-items: end;
                    flex-shrink: 0;
                    width: fit-content;

                    > :global(.progress) {
                        position: absolute;
                        top: 0;
                        left: 0;

                        > :global(span) {
                            display: none;
                        }

                        :global(div) {
                            transition: 0.2s ease-in-out;

                            @apply mx-4 h-2 hover:h-3 rounded-full;

                            > :global(span) {
                                @apply h-full;
                            }
                        }

                        @apply w-full;
                    }

                    .buttons {
                        :global(div) {
                            @apply mb-0;
                        }
                    }
                }
            }
        }
    }
</style>