<script lang="ts">
    import { ScrollArea } from "@/components/ui/scroll-area";
    import type { ScrollAreaRootProps } from 'bits-ui';
    import { LRC } from 'lrclib.js';
    import { cn } from '$lib/helpers/utils';
    import type { ClassValue } from 'clsx';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import { untrack } from 'svelte';

    let {
        lyrics,
        currentTime = $bindable(0),
        delay = 0,
        ...props
    }: {
        lyrics: string;
        currentTime: number;
        delay?: number;
		scrollbarXClasses?: ClassValue;
		scrollbarYClasses?: ClassValue;
    } & ScrollAreaRootProps = $props();

    let lines = $derived(LRC.parse(lyrics).filter(l => l.type === LRC.LineType.LYRIC));
    let activeLyrics = $derived(LRC.getActiveLyrics(lines, (currentTime - delay) * 1000));
    let activeLines = $derived(activeLyrics.lines.map(l => document.getElementById(`line-${l.line.lineNumber}`)).filter(Boolean) as HTMLButtonElement[]);
    let container: HTMLDivElement|null = $state(null);
    let autoScroll = $state(true);

    $effect(() => {
        if (!autoScroll) return;

        activeLines.forEach(line => {
            container?.scrollTo({
                top: untrack(() => userInterface.smallScreen.current) ? line.offsetTop : line.offsetTop - (container?.offsetHeight || 0) / 3,
                behavior: untrack(() => settings.prefersReducedMotion) ? 'auto' : 'smooth',
            })
        });
    });

    $effect(() => {
        if (currentTime == 0) container?.scrollTo(0, 0);
    });
</script>

<ScrollArea
    {...props}
    bind:viewport={container}
    class={cn(props.class)}
    scrollbarYClasses={cn(props.scrollbarYClasses, "[&>div]:bg-current/50")}
    scrollbarXClasses={cn(props.scrollbarXClasses, "[&>div]:bg-current/50")}
>
    <div class="grid gap-4">
        <div class="h-20"></div>
        {#each lines as line (line.lineNumber)}
            {@const words = line.content.trim().split(' ')}
            {@const active = activeLyrics.lines.find(l => l.line.lineNumber === line.lineNumber)}
            {@const sung = !active && line.startMillisecond < currentTime * 1000}
            {@const time = line.startMillisecond / 1000}
            <button
                id="line-{line.lineNumber}"
                onclick={() => currentTime = time + delay}
                class={cn(
                    "w-full text-start flex cursor-pointer flex-wrap space-x-2 -space-y-2 transition-all",
                    settings.prefersReducedMotion ? "duration-0" : "duration-200",
                )}
            >
                {#if words.length > 0}
                    {#each words as word, i}
                        <span
                            class={cn(
                                "transition-[filter,translate,opacity,color] ease-out",
                                !settings.prefersReducedTransparency && autoScroll && "blur-[2px]",
                                settings.prefersReducedMotion
                                    ? "duration-0"
                                    : [
                                        active ? "duration-500" : "duration-200",
                                        active || sung ? "translate-y-0" : "translate-y-2",
                                    ],
                                (sung || !active) && "opacity-30",
                                active && "blur-none opacity-100"
                            )}
                            style={!settings.prefersReducedMotion && active ? `transition-delay: ${i * 100}ms;` : ""}
                        >
                            {word}
                        </span>
                    {/each}
                {:else}
                    <span>Interlude</span>
                {/if}
            </button>
        {/each}
        <div class="h-20"></div>
    </div>
</ScrollArea>