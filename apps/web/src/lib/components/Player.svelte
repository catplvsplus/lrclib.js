<script lang="ts">
    import type { APITrackSignatureResponse, Track, TrackSyncedLyrics } from 'lrclib';
    import { parseBlob, selectCover, type IAudioMetadata } from 'music-metadata';
    import { onDestroy, onMount } from 'svelte';
    import PlayerProgress from './PlayerProgress.svelte';
    import PlayerControls from './PlayerControls.svelte';
    import { cn, getCurrentTimeLineIndex } from '../helpers/utils';
    import PlayerLyrics from './PlayerLyrics.svelte';
    import { FastAverageColor, type FastAverageColorResult } from 'fast-average-color';
    import { enableBlur } from '../stores/enableBlur';
    import { base } from '$app/paths';

    export let lyrics: TrackSyncedLyrics|string;
    export let track: Pick<APITrackSignatureResponse, 'artistName'|'trackName'>;
    export let name: string;
    export let blob: Blob;
    export let audio: string;

    let data: IAudioMetadata|null = null;
    let albumCover: string = base + '/images/album.png';
    let albumCoverBlob: Uint8Array|undefined = undefined;

    let duration: number;
    let currentTime: number;
    let paused: boolean;
    let muted: boolean = false;
    let currentTimeLineIndex: number|undefined = undefined;

    let primaryColor: FastAverageColorResult|undefined = undefined;
    let wakeLock: WakeLockSentinel|null = null;

    onMount(async () => {
        data = await parseBlob(blob);

        const cover = data?.common?.picture?.[0] ? selectCover(data.common.picture) ?? undefined : undefined;

        albumCoverBlob =  cover?.data;

        albumCover = cover
            ? URL.createObjectURL(new Blob([cover.data], {
                type: cover.format
            }))
            : base + '/images/album.png';

        const fac = new FastAverageColor();
        primaryColor = await fac.getColorAsync(albumCover).catch(() => undefined);

        wakeLock = await window.navigator.wakeLock.request('screen').catch(() => null);
    });

    async function createWakeLock(releaseOld: boolean = true): Promise<WakeLockSentinel|null> {
        if (releaseOld && wakeLock && !wakeLock?.release) {
            await wakeLock.release();
            wakeLock = null;
        }

        wakeLock = wakeLock ?? await window.navigator.wakeLock.request('screen').catch(() => null);
        if (!wakeLock) return null;

        wakeLock.addEventListener('release', () => wakeLock = null);

        return wakeLock;
    }

    onDestroy(() => albumCover ? URL.revokeObjectURL(albumCover) : null);

    $: currentTime, currentTimeLineIndex = typeof lyrics !== 'string' ? getCurrentTimeLineIndex(currentTime, lyrics) : undefined;
</script>

<audio
    src={audio}
    bind:duration
    bind:currentTime
    bind:paused
    {muted}
    autoplay
    on:pause={() => wakeLock?.release()}
    on:play={() => createWakeLock()}
/>
<div
    class="w-full h-full flex justify-center items-center relative"
    style={!$enableBlur && primaryColor ? `background: ${primaryColor.hex}` : ''}
>
    <div class="h-full w-full relative overflow-hidden max-w-[2300px] pt-14">
        {#if $enableBlur}
            <div class="h-full w-full top-0 left-0 absolute overflow-hidden">
                <img src={albumCover} alt="" class="absolute h-full w-full">
                <img src={albumCover} alt="" class="animate-spin rounded-full absolute h-screen top-0 left-0" style="animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
                <img src={albumCover} alt="" class="animate-spin rounded-full absolute h-screen bottom-0 right-0" style="animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
                <img src={albumCover} alt="" class="animate-spin rounded-full absolute h-screen top-1/2 left-1/2 bottom-0 " style="animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
            </div>
        {/if}
        <div class={cn(
            "content h-full w-full top-0 left-0 absolute backdrop-saturate-150 bg-black/60 pt-14 flex justify-center items-center gap-16",
            $enableBlur ? 'backdrop-blur-[10vh]' : ''
        )}>
            <div class="player flex flex-col gap-4 shrink-0 w-1/3 max-w-[500px] items-center">
                <div class="cover rounded-md overflow-hidden h-96 w-96 relative">
                    <img src={albumCover} alt="" class="h-full w-full">
                </div>
                <div class="details flex flex-col text-center max-w-96 w-full">
                    <h1 class="text-3xl text-white font-bold max-w-96 whitespace-nowrap overflow-hidden">{data?.common.title || track.trackName}</h1>
                    <p class="text-neutral-400 max-w-96 whitespace-nowrap overflow-hidden">{data?.common.artists || track.artistName}</p>
                </div>
                <div class="controls flex flex-col gap-2 max-w-96 w-full">
                    <PlayerProgress bind:duration bind:currentTime class="progress"/>
                    <div class="buttons flex justify-center">
                        <PlayerControls bind:paused bind:muted bind:blob bind:track bind:lyrics bind:cover={albumCoverBlob} bind:name class="mb-4"/>
                    </div>
                </div>
            </div>
            <div class="lyrics h-full w-1/2 max-w-[800px]">
                <PlayerLyrics bind:lyrics bind:currentTime bind:currentTimeLineIndex bind:allowBlur={$enableBlur}/>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @media (max-width: 1050px) {
        .content {
            flex-direction: column;

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