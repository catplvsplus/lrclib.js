<script lang="ts">
    import type { Track } from 'lrclib';
    import { cn } from '../helpers/utils';

    export let track: Track;
    export let currentTime: number;
    export let currentTimeLineIndex: number|undefined;

    let container: HTMLDivElement;

    $: currentTimeLineIndex, (() => {
        const line = container.querySelector<HTMLDivElement>(`#lyric-${currentTimeLineIndex}`);
        if (!line) return;

        container.scrollBy({ top: line.scrollHeight, behavior: 'smooth' });
    });
</script>

<div {...$$props} class={cn("h-full w-full overflow-y-auto text-5xl font-bold p-6 leading-relaxed no-scrollbar", $$props.class)} bind:this={container}>
    {#if track.isSynced}
        {#each track.syncedLyricsJSON as line, index}
            <a
                href="#lyric-{index}"
                class='block data-[active="true"]:text-white/80 data-[active="true"]:scale-105 data-[active="true"]:translate-x-5 data-[active="false"]:blur-sm data-[active="true"]:animate-glow hover:text-white/85 hover:!blur-0 text-muted-foreground/60'
                id={`lyric-${index}`}
                style="transition: 0.5s;"
                on:click|preventDefault={() => currentTime = line.timeMs / 1000}
                data-active={index === currentTimeLineIndex}
            >
                {line.text}
            </a>
        {/each}
    {:else}
        {track.plainLyrics}
    {/if}
</div>