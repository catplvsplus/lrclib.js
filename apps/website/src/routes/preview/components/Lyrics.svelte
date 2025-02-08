<script lang="ts">
    import { Utils, type TrackDurationLyrics, type TrackSyncedLyric, type TrackSyncedLyrics } from 'lrclib';
    import { cn, getBlurAmount } from '$lib/helpers/utils';
    import { ScrollArea } from '../../../lib/components/ui/scroll-area';
    import { isBlurAllowed } from '../../../lib/helpers/stores';

    let {
        lyrics = $bindable(),
        currentTime = $bindable(),
        ...props
    }: {
        lyrics: string|TrackSyncedLyrics|null;
        currentTime: number;
        [key: string]: any;
    } = $props();

    let scrollArea: HTMLDivElement|null = $state(null);
    let scrollOwner: 'user'|'auto' = $state('auto');
    let scrollPosition: ScrollLogicalPosition = $state('center');
    let activeLines: TrackDurationLyrics|null = $derived(
        typeof lyrics !== 'string' && Array.isArray(lyrics)
            ? Utils.getActiveLines(lyrics, currentTime * 1000)
            : null
    );
    let activeLine: HTMLAnchorElement|null = $state(null);
    let isSynced: boolean = $derived(typeof lyrics === 'string' ? false : !!lyrics);

    $effect(() => {
        if (scrollOwner === 'auto') {
            activeLine?.parentElement?.scrollIntoView({
                behavior: 'smooth',
                block: scrollPosition,
                inline: 'nearest'
            });
        } else {
            updateScrollOwner();
        }
    });

    function onLineClick(e: MouseEvent & { currentTarget: HTMLAnchorElement }, line: TrackSyncedLyric) {
        e.preventDefault();

        currentTime = line.timeMs / 1000;
        updateScrollOwner();
    }

    function updateScrollOwner() {
        if (!isSynced || !activeLines?.lastLineIndex || !scrollArea) return;

        const line = scrollArea?.querySelector<HTMLDivElement>(`#lyric-${activeLines?.lastLineIndex}`)?.parentElement;
        if (!line) return;

        const isVisible = line.getBoundingClientRect().top >= 0 && line.getBoundingClientRect().bottom <= window.innerHeight;

        if (isVisible && scrollOwner === 'auto') {
            scrollOwner = 'user';
        } else if (!isVisible && scrollOwner === 'user') {
            scrollOwner = 'auto';
        }
    }
</script>

<div {...props} class={cn("h-full w-full text-white/90", props.class)}>
    {#if typeof lyrics === 'string'}
        {@const lines = lyrics.split('\n').map((line, index) => [line, index])}
        <ScrollArea class="h-full w-full" style="mask: var(--mini-mask);" orientation="vertical">
            <div class="p-20 text-5xl font-bold leading-snug">
                {#each lines as [line, index]}
                    <p id={index.toString()}>{line}</p>
                {/each}
            </div>
        </ScrollArea>
    {:else if Array.isArray(lyrics) && lyrics.length > 0}
        <div
            class="h-full w-full overflow-auto no-scrollbar"
            style="mask: var(--large-mask);"
            bind:this={scrollArea}
            onwheel={updateScrollOwner}
        >
            <div class="p-20 text-5xl font-bold leading-snug flex flex-col gap-4">
                {#snippet SyncedLine(line: TrackSyncedLyric, index: number, isActive: boolean)}
                    {#if isActive}
                        <a href="#lyric-{index.toString()}" onclick={e => onLineClick(e, line)} bind:this={activeLine}>
                            {line.text}
                        </a>
                    {:else}
                        <a href="#lyric-{index.toString()}" onclick={e => onLineClick(e, line)}>
                            {line.text}
                        </a>
                    {/if}
                {/snippet}
                {#each lyrics as line, index}
                    {@const isActive = activeLines?.lastLineIndex === index}
                        <p
                            id={`lyric-${index.toString()}`}
                            class={cn(
                                "cursor-pointer duration-1000 transition-all leading-tight",
                                isActive
                                    ? $isBlurAllowed
                                        ? `text-white animate-glow scale-105 translate-x-[2%]`
                                        : "text-white scale-105 translate-x-[2%]"
                                    : `scale-100 translate-x-0 text-white/40`
                            )}
                            style="filter: {
                                scrollOwner === 'auto' && $isBlurAllowed && !isActive
                                    ? activeLines?.lastLineIndex
                                        ?  getBlurAmount(activeLines?.lastLineIndex, index)
                                        : 'blur(2px)'
                                    : 'none'
                            };"
                        >
                            {@render SyncedLine(line, index, isActive)}
                        </p>
                        <p id={index.toString()}>
                        </p>
                {/each}
            </div>
        </div>
    {/if}
</div>