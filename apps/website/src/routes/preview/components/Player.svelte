<script lang="ts">
    import type { IAudioMetadata } from '$lib/helpers/types';
    import { error } from '@sveltejs/kit';
    import type { Track, TrackSyncedLyrics } from 'lrclib';
    import { cn, getAudioMetadata, getTrackDefaultMetadata } from '$lib/helpers/utils';
    import type { FastAverageColorResult } from 'fast-average-color';
    import Controls from './Controls.svelte';
    import Background from './Background.svelte';
    import NavBar from '../../../lib/components/shared/NavBar.svelte';
    import Lyrics from './Lyrics.svelte';
    import { isBlurAllowed } from '../../../lib/helpers/stores';
    import { MediaQuery } from 'svelte/reactivity';
    import NowPlaying from './NowPlaying.svelte';

    let {
        track = $bindable(),
        file = $bindable(),
        ...props
    }: {
        track: Track;
        file: Blob;
    } = $props();

    const seekAmount = 5;

    let metadata: IAudioMetadata = $state(getTrackDefaultMetadata(track));
    let audio: string|null = $state(null);
    let averageColor: FastAverageColorResult|null = $state(null);
    let currentTime: number = $state(0);
    let duration: number = $state(0);
    let paused: boolean = $state(false);
    let wakelock: WakeLockSentinel|null = $state(null);
    let isFullscreen: boolean = $state(false);
    let lyrics: string|TrackSyncedLyrics|null = $state(null);
    let isSmallScreen = new MediaQuery("(max-width: 1020px)");

    $effect(() => {
        if (!track) error(403, 'No track provided');
        audio = URL.createObjectURL(file);

        getAudioMetadata(file, track)
            .then(res => metadata = res);
    });

    $effect(() => {
        if (isFullscreen) {
            document.body.requestFullscreen({
                navigationUI: 'hide'
            });
        } else {
            if (document.fullscreenElement) document.exitFullscreen();
        }
    });

    async function createWakeLock(releaseOld: boolean = true) {
        if (!('wakeLock' in navigator)) return;

        if (releaseOld && wakelock) await wakelock.release();

        wakelock = await navigator.wakeLock.request('screen').catch(() => null);

        wakelock?.addEventListener('release', () => wakelock = null);
        return wakelock;
    }

    function switchLyricsType() {
        if (typeof lyrics === 'string') {
            lyrics = track.isSynced() ? track.syncedLyricsJSON : track.plainLyrics;
        } else {
            lyrics = track.isPlain() ? track.plainLyrics : track.syncedLyricsJSON;
        }
    }
</script>

<svelte:window
    onfullscreenchange={() => {
        isFullscreen = !!document.fullscreenElement;
    }}
    onkeydown={(e) => {
        e.preventDefault();
        if (e.key === 'Escape') isFullscreen = false;
        if (e.key === ' ') paused = !paused;
        if (e.key === 'f' || e.key === 'F11') isFullscreen = !isFullscreen;
        if (e.key === 'l') switchLyricsType();
        if (e.key === 'ArrowLeft') currentTime = currentTime - seekAmount < 0 ? 0 : currentTime - seekAmount;
        if (e.key === 'ArrowRight') currentTime = currentTime + seekAmount > duration ? duration : currentTime + seekAmount;
    }}
    onkeyup={(e) => {
        e.preventDefault();
        if (e.key === 'b') $isBlurAllowed = !$isBlurAllowed;
    }}
/>

{#if audio}
    <audio
        src={audio}
        bind:currentTime
        bind:duration
        bind:paused
        onplay={() => createWakeLock()}
        onpause={() => wakelock?.release()}
    ></audio>
    {#if !isFullscreen && !isSmallScreen.current}<NavBar addSearchBox={false} useAnimation useTransparency/>{/if}
    <Background class="z-0 top-0 left-0 fixed" bind:metadata bind:averageColor bind:paused/>
    <div class={cn("relative z-10 transition-all min-h-[500px] duration-500 select-none text-white flex justify-center h-full px-5 pt-0", !isFullscreen || isSmallScreen.current ? "pt-16" : "" )}>
        <div class="w-full h-full flex justify-center max-w-screen-2xl gap-20 p-5 items">
            <div class={cn("w-[500px] h-full shrink-0 flex justify-center items-center controls")}>
                <Controls bind:metadata bind:averageColor bind:paused bind:currentTime bind:duration bind:isFullscreen/>
            </div>
            {#if track.isSynced() || track.plainLyrics}
                <div class="w-full h-full max-w-2xl lyrics">
                    <Lyrics lyrics={lyrics ?? (track.isSynced() ? track.syncedLyricsJSON : track.plainLyrics)} bind:currentTime/>
                </div>
            {/if}
            {#if isSmallScreen.current}
                <NowPlaying bind:metadata bind:averageColor/>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    @media screen and (max-width: 1230px) {
        .items {
            @apply gap-12;

            .controls {
                @apply w-[400px];
            }
        }
    }

    @media screen and (max-width: 1020px) {
        .items {
            @apply gap-0 flex-col-reverse items-start justify-normal px-0 h-full;

            .controls,
            .lyrics {
                @apply h-auto;
            }


            .controls {
                @apply w-full;
            }

            .lyrics {
                @apply w-full h-[calc(100%-10rem)];
            }
        }
    }
</style>