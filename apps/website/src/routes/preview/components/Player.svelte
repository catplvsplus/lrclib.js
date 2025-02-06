<script lang="ts">
    import type { IAudioMetadata } from '$lib/helpers/types';
    import { error } from '@sveltejs/kit';
    import type { Track } from 'lrclib';
    import { cn, getAudioMetadata, getTrackDefaultMetadata } from '$lib/helpers/utils';
    import type { FastAverageColorResult } from 'fast-average-color';
    import Controls from './Controls.svelte';
    import Background from './Background.svelte';
    import NavBar from '../../../lib/components/shared/NavBar.svelte';

    let {
        track = $bindable(),
        file = $bindable(),
        ...props
    }: {
        track: Track;
        file: Blob;
    } = $props();

    let metadata: IAudioMetadata = $state(getTrackDefaultMetadata(track));
    let audio: string|null = $state(null);
    let averageColor: FastAverageColorResult|null = $state(null);
    let currentTime: number = $state(0);
    let duration: number = $state(0);
    let paused: boolean = $state(false);
    let wakelock: WakeLockSentinel|null = $state(null);
    let isFullscreen: boolean = $state(false);

    $effect(() => {
        if (!track) error(403, 'No track provided');
        audio = URL.createObjectURL(file);

        getAudioMetadata(file, track)
            .then(res => metadata = res);
    });

    $effect(() => {
        if (isFullscreen) {

        }
    });

    async function createWakeLock(releaseOld: boolean = true) {
        if (!('wakeLock' in navigator)) return;

        if (releaseOld && wakelock) await wakelock.release();

        wakelock = await navigator.wakeLock.request('screen').catch(() => null);

        wakelock?.addEventListener('release', () => wakelock = null);
        return wakelock;
    }
</script>

{#if audio}
    <audio
        src={audio}
        bind:currentTime
        bind:duration
        bind:paused
        onplay={() => createWakeLock()}
        onpause={() => wakelock?.release()}
    ></audio>
    {#if !isFullscreen}<NavBar addSearchBox={false}/>{/if}
    <Background class="z-0 top-0 left-0 fixed" bind:metadata bind:averageColor bind:paused/>
    <div class={cn("relative z-10 transition-all duration-500 select-none text-white flex justify-center h-full pt-0", !isFullscreen && "pt-16")}>
        <div class={cn("min-w-[calc(500px+2rem)] h-full shrink-0 flex justify-center items-center")}>
            <Controls bind:metadata bind:averageColor bind:paused bind:currentTime bind:duration bind:isFullscreen/>
        </div>
        <div class="w-1/2 h-full"></div>
    </div>
{/if}