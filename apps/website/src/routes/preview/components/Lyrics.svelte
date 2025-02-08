<script lang="ts">
    import { Utils, type TrackDurationLyrics, type TrackSyncedLyric, type TrackSyncedLyrics } from 'lrclib';
    import { cn, getBlurAmount } from '$lib/helpers/utils';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import { isBlurAllowed } from '$lib/helpers/stores';

    let {
        lyrics = $bindable(),
        currentTime = $bindable(),
        ...props
    }: {
        lyrics: string|TrackSyncedLyrics|null;
        currentTime: number;
        [key: string]: any;
    } = $props();

    let scrollArea: HTMLDivElement = $state()!;
    let container: HTMLDivElement = $state()!;
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
        scrollOwner = 'auto';
    }

    function updateScrollOwner() {
        if (!isSynced || !activeLines?.lastLineIndex) return;

        const line = activeLine?.parentElement as HTMLParagraphElement;
        if (!line) return;

        // check if the active line is visible in the scroll area
        const isVisible = scrollArea.scrollTop > line.offsetTop - (scrollArea.offsetHeight / 2) + line.offsetHeight / 2 || scrollArea.scrollTop < line.offsetTop - (scrollArea.offsetHeight / 2) - line.offsetHeight / 2;

        if (isVisible && scrollOwner === 'auto') {
            scrollOwner = 'user';
        } else if (!isVisible && scrollOwner === 'user') {
            scrollOwner = 'auto';
        }
    }
</script>

<div {...props} class={cn("h-full w-full text-white/90", props.class)} bind:this={container}>
    {#if typeof lyrics === 'string'}
        {@const lines = lyrics.split('\n').map((line, index) => [line, index])}
        <ScrollArea class="h-full w-full" style="mask: var(--mini-mask); -webkit-mask: var(--mini-mask);" orientation="vertical">
            <div class="p-5 pt-80 pb-80 text-5xl font-bold leading-snug">
                {#each lines as [line, index]}
                    <p id={index.toString()}>{line}</p>
                {/each}
            </div>
        </ScrollArea>
    {:else if Array.isArray(lyrics) && lyrics.length > 0}
        <div
            class="h-full w-full overflow-auto no-scrollbar"
            style="mask: var(--large-mask); -webkit-mask: var(--large-mask);"
            bind:this={scrollArea}
            onwheel={updateScrollOwner}
        >
            <div class="p-5 pr-8 pt-80 pb-80 text-5xl font-bold leading-snug flex flex-col gap-4 w-full">
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
                                "duration-1000 transition-all leading-tight will-change-transform text-wrap",
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