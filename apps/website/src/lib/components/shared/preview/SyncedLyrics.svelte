<script lang="ts">
    import { ScrollArea } from "@/components/ui/scroll-area";
    import type { ScrollAreaRootProps } from 'bits-ui';
    import { LRC } from 'lrclib.js';
    import { cn } from '$lib/helpers/utils';
    import type { ClassValue } from 'clsx';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import { untrack } from 'svelte';
    import Interlude from './Interlude.svelte';
    import { useDebounce, useIntersectionObserver } from 'runed';

    let {
        lyrics,
        currentTime = $bindable(0),
        delay = 0,
        scrollAlign,
        scrollMargin,
        ...props
    }: {
        lyrics: string;
        currentTime: number;
        delay?: number;
        scrollAlign?: 'start'|'center'|'end';
        scrollMargin?: number;
		scrollbarXClasses?: ClassValue;
		scrollbarYClasses?: ClassValue;
    } & ScrollAreaRootProps = $props();

    let lines = $derived(LRC.parse(lyrics).filter(l => l.type === LRC.LineType.LYRIC));
    let activeLyrics = $derived(LRC.getActiveLyrics(lines, (currentTime - delay) * 1000));
    let activeLines = $derived(activeLyrics.lines.map(l => document.getElementById(`line-${l.line.lineNumber}`)).filter(Boolean) as HTMLButtonElement[]);
    let container: HTMLDivElement|null = $state(null);

    let linesVisible = $state(true);
    let autoScroll = $state(true);

    const checkVisibleLines = useDebounce(() => {
        autoScroll = linesVisible;
    }, 1000);

    useIntersectionObserver(
        () => activeLines,
        event => {
            linesVisible = event.some(l => l.isIntersecting);
        },
        {
            root: () => container
        }
    );

    $effect(() => {
        if (!autoScroll) return;

        const line = activeLines.at(0);
        const top = line
            ? getScrollPosition(line)
            : untrack(() => {
                if (!currentTime) return 0;

                const lastLine = lines.at(-1);
                return lastLine && currentTime * 1000 <= lastLine.startMillisecond
                    ? 0
                    : null;
            });

        if (top === null) return;

        container?.scrollTo({
            top,
            behavior: untrack(() => settings.prefersReducedMotion) ? 'instant' : 'smooth',
        });
    });

    $effect(() => {
        if (!container) return;

        function onUserScroll() {
            autoScroll = false;
            checkVisibleLines();
        }

        container.addEventListener('wheel', onUserScroll);
        container.addEventListener('touchmove', onUserScroll);

        return () => {
            container?.removeEventListener('wheel', onUserScroll);
            container?.removeEventListener('touchmove', onUserScroll);
        }
    });

    $effect(() => {
        lyrics;
        autoScroll = true;
    });

    function getScrollPosition(line: HTMLElement): number {
        let position: number;

        switch (scrollAlign) {
            case 'start':
                position = line.offsetTop;
                break;
            case 'center':
                position = line.offsetTop - (container?.offsetHeight || 0) / 3;
                break;
            case 'end':
                position = line.offsetTop - (container?.offsetHeight || 0);
                break;
            default:
                position = userInterface.smallScreen.current
                    ? line.offsetTop
                    : line.offsetTop - (container?.offsetHeight || 0) / 3;
                break;
        }

        return position + (scrollMargin || 0);
    }
</script>

<ScrollArea
    {...props}
    bind:viewport={container}
    class={cn(props.class)}
    scrollbarYClasses={cn(props.scrollbarYClasses, "[&>div]:bg-current/50")}
    scrollbarXClasses={cn(props.scrollbarXClasses, "[&>div]:bg-current/50")}
>
    <div class="grid gap-4 px-2">
        <div class="h-20"></div>
        {#each lines as line (line.lineNumber)}
            {@const words = line.content.trim().split(' ').filter(Boolean)}
            {@const active = activeLyrics.lines.find(l => l.line.lineNumber === line.lineNumber)}
            {@const sung = !active && line.startMillisecond < currentTime * 1000}
            {@const time = line.startMillisecond / 1000}
            <button
                id="line-{line.lineNumber}"
                onclick={() => {
                    currentTime = time + delay;
                    autoScroll = true;
                }}
                class={cn(
                    "w-full text-start flex cursor-pointer flex-wrap space-x-2 -space-y-2 transition-all",
                    settings.prefersReducedMotion ? "duration-0" : "duration-200",
                )}
            >
                {#if words.length}
                    {#each words as word, i}
                        <span
                            class={cn(
                                "transition-[filter,translate,opacity,color] ease-out",
                                !settings.prefersReducedTransparency && autoScroll && "blur-[2px]",
                                settings.prefersReducedMotion
                                    ? "duration-0"
                                    : [
                                        "duration-500",
                                        active || sung ? "translate-y-0" : "translate-y-5",
                                    ],
                                (sung || !active) && "opacity-30",
                                active && "blur-none opacity-100"
                            )}
                            style={!settings.prefersReducedMotion && active ? `transition-delay: ${i * 40}ms;` : ""}
                        >
                            {word}
                        </span>
                    {/each}
                {:else}
                    <Interlude class={active ? "opacity-100" : sung ? "opacity-0" : "h-0 opacity-0"}/>
                {/if}
            </button>
        {/each}
        <div class="h-20"></div>
    </div>
</ScrollArea>