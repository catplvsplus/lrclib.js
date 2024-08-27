<script lang="ts">
    import type { Track } from 'lrclib';
    import { cn } from '../helpers/utils';

    export let track: Track;
    export let currentTime: number;
    export let currentTimeLineIndex: number|undefined;

    let container: HTMLDivElement;

    $: currentTimeLineIndex, (() => {
        const line = container?.querySelector<HTMLDivElement>(`#lyric-${currentTimeLineIndex}`);
        if (!line) return;

        // container.scrollTop = line.offsetTop - (container.offsetHeight / 2) + line.offsetHeight / 2;
        line.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    })();
</script>

<div
    {...$$props}
    class={cn("h-full w-full overflow-y-auto text-5xl font-bold p-6 leading-relaxed no-scrollbar", $$props.class)}
    bind:this={container}
    style={track.isSynced ? "mask: var(--mask); -webkit-mask: var(--mask);" : ""}
>
    {#if track.isSynced}
        {#each track.syncedLyricsJSON as line, index}
            <a
                href="#lyric-{index}"
                class={cn(
                    'block data-[active="true"]:text-white/80 data-[active="true"]:scale-105 data-[active="true"]:translate-x-5 data-[active="false"]:blur-sm data-[active="true"]:animate-glow hover:text-white/85 hover:!blur-0 text-muted-foreground/60',
                    index === 0 ? 'pt-72' : '',
                    index === track.syncedLyricsJSON.length - 1 ? 'pb-72' : ''
                )}
                id="lyric-{index}"
                style="transition: 0.5s; max-width: 90%;"
                on:click|preventDefault={() => currentTime = line.timeMs / 1000}
                data-active={index === currentTimeLineIndex}
            >
                {line.text}
            </a>
        {/each}
    {:else}
        {@const lines = (track.plainLyrics ?? '').split('\n')}
        {#each lines as line, index}
            {#if line}
                <p
                    class={cn(
                        "select-text",
                        index === 0 ? 'pt-72' : '',
                        index === lines.length - 1 ? 'pb-72' : ''
                    )}
                >{line}</p>
            {:else}
                <br class="leading-10"/>
            {/if}
        {/each}
    {/if}
</div>