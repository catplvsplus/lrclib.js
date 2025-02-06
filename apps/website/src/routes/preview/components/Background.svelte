<script lang="ts">
    import { cn } from '$lib/helpers/utils';
    import type { FastAverageColorResult } from 'fast-average-color';
    import type { IAudioMetadata } from '$lib/helpers/types';
    import { isBlurAllowed } from '../../../lib/helpers/stores';
    import { fade } from 'svelte/transition';

    let {
        metadata = $bindable(),
        averageColor = $bindable(),
        paused = $bindable(),
        ...props
    }: {
        metadata: IAudioMetadata;
        averageColor: FastAverageColorResult|null;
        paused: boolean;
        [key: string]: any;
    } = $props();
</script>

<div class={cn("h-full w-full relative", props.class)}>
    {#if $isBlurAllowed}
        <div class={cn("h-full w-full z-10 absolute top-0 left-0 backdrop-saturate-200 backdrop-blur-[10vh] bg-black/50")} out:fade={{ delay: 500, duration: 500 }} in:fade={{ duration: 500 }}></div>
        <div class="h-full w-full top-0 left-0 absolute overflow-hidden" out:fade={{ duration: 500 }} in:fade={{ duration: 500, delay: 500 }}>
            <img src={metadata.cover} alt="" class="absolute h-full w-full">
            <img src={metadata.cover} alt="" class="animate-spin rounded-full absolute h-screen top-0 left-0" style="scale: 1.23; animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
            <img src={metadata.cover} alt="" class="animate-spin rounded-full absolute h-screen bottom-0 right-0 direction-reverse" style="scale: 1.23; animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
            <img src={metadata.cover} alt="" class="animate-spin rounded-full absolute h-screen top-1/2 left-1/3 bottom-0" style="scale: 1.23; animation-duration: 20s; animation-play-state: {paused ? 'paused' : 'running'};">
        </div>
    {:else}
        <div class="h-full w-full z-10 absolute top-0 left-0" style="background-color: {averageColor?.hex ?? 'hsl(var(--muted))'};" in:fade={{ duration: 500 }} out:fade={{ duration: 1000 }}></div>
    {/if}
</div>

<style lang="scss">
    * {
        user-select: none;
        -webkit-user-drag: none;
    }

    img {
        will-change: transform;
    }
</style>