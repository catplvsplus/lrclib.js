<script lang="ts">
    import { FastAverageColor, type FastAverageColorResult } from 'fast-average-color';
    import type { IAudioMetadata } from '$lib/helpers/types';
    import { cn, createLocalDownload } from '$lib/helpers/utils';
    import { DateTime } from 'luxon';
    import { fade } from 'svelte/transition';
    import { Button } from '../../../lib/components/ui/button';
    import { Download, Maximize2, Minimize2, Pause, Play } from 'lucide-svelte';
    import { AspectRatio } from '../../../lib/components/ui/aspect-ratio';
    import { toast } from 'svelte-sonner';
    import type { TrackSyncedLyrics } from 'lrclib';

    let {
        averageColor = $bindable(),
        metadata = $bindable(),
        currentTime = $bindable(),
        duration = $bindable(),
        paused = $bindable(),
        isFullscreen = $bindable(),
        lyrics = $bindable(),
        ...props
    }: {
        averageColor: FastAverageColorResult|null;
        metadata: IAudioMetadata;
        currentTime: number;
        duration: number;
        paused: boolean;
        isFullscreen: boolean;
        lyrics: string|TrackSyncedLyrics|null;
        [key: string]: any;
    } = $props();

    let image: HTMLImageElement;
    let progressTrack: HTMLDivElement;

    $effect(() => {
        const fac = new FastAverageColor();

        fac.getColorAsync(metadata.cover, {
            algorithm: 'dominant'
        }).then(res => averageColor = res);
    });

    function pointerSeek(event: PointerEvent) {
        event.preventDefault();

        function seek(e: PointerEvent) {
            const { left, width } = progressTrack.getBoundingClientRect();

            let p = (e.clientX - left) / width;
            if (p < 0) p = 0;
            if (p > 1) p = 1;

            currentTime = p * duration;
        }

        seek(event);

        window.addEventListener('pointermove', seek);
        window.addEventListener('pointerup', () => {
            window.removeEventListener('pointermove', seek);
        }, { once: true });
    }

    $effect(() => {
        if (isFullscreen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    });

    function downloadLyrics() {
        if (!lyrics) return;

        const text = typeof lyrics === 'string' ? lyrics : lyrics.map(({ text }) => text).join('\n');

        createLocalDownload(text, `${metadata.title}.lrc`);
        toast.success(`Lyrics downloaded!`);
    }
</script>

<div class={cn("flex flex-col items-center w-full gap-3", props.class)}>
    <div class={cn("max-[1020px]:hidden w-full")}>
        <AspectRatio ratio={1/1} class="w-full relative overflow-hidden rounded-lg shadow-lg">
            <img src={metadata.cover} alt={metadata.title} class="object-cover h-full w-full" bind:this={image}>
        </AspectRatio>
    </div>
    <div class={cn("text-center flex flex-col text-nowrap w-full mt-2 *:text-ellipsis *:overflow-hidden max-[1020px]:hidden")}>
        <h1 class="text-3xl font-bold">{metadata.title}</h1>
        <h4 class="opacity-65">{metadata.artist}</h4>
    </div>
    <div class={cn("flex items-center justify-between w-full gap-4 mt-2 font-semibold text-white/70 max-[1020px]:[&>span]:hidden max-[1020px]:flex-col")}>
        <span class="min-w-11 text-left" in:fade>{DateTime.fromSeconds(currentTime).toFormat('mm:ss')}</span>
        <div class="w-full h-1.5 rounded-full bg-white/50" onpointerdown={pointerSeek} bind:this={progressTrack}>
            <span class="block relative h-1.5 rounded-full bg-white/70" style="width: {(currentTime / duration) * 100}%;">
                <span class="absolute block top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md"></span>
            </span>
        </div>
        <span class="min-w-11 text-right">{DateTime.fromSeconds(duration).toFormat('mm:ss')}</span>
        <div class={cn("flex justify-between w-full text-sm min-[1020px]:hidden text-white/50")}>
            <span class="min-w-11 text-left" in:fade>{DateTime.fromSeconds(currentTime).toFormat('mm:ss')}</span>
            <span class="min-w-11 text-right">{DateTime.fromSeconds(duration).toFormat('mm:ss')}</span>
        </div>
    </div>
    <div class="flex items-center gap-5 mt-1">
        <Button
            variant="ghost"
            size="icon"
            title=""
            class="h-11 w-11 bg-white/5 hover:bg-white/10 rounded-full [&_svg]:size-5 !text-white"
            onclick={downloadLyrics}
            disabled={!lyrics}
        >
            <Download/>
        </Button>
        <Button
            variant="ghost"
            size="icon"
            title={paused ? 'Play' : 'Pause'}
            onclick={() => paused = !paused}
            class="h-20 w-20 bg-white/5 hover:bg-white/10 rounded-full [&_svg]:size-11 !text-white"
        >
            {#if paused}
                <Play fill="currentColor"/>
            {:else}
                <Pause fill="currentColor"/>
            {/if}
        </Button>
        <Button
            variant="ghost"
            size="icon"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            onclick={() => isFullscreen = !isFullscreen}
            class="h-11 w-11 bg-white/5 hover:bg-white/10 rounded-full [&_svg]:size-5 !text-white"
        >
            {#if isFullscreen}
                <Minimize2/>
            {:else}
                <Maximize2/>
            {/if}
        </Button>
    </div>
</div>