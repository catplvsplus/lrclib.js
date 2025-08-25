<script lang="ts">
    import { ScrollArea } from "@/components/ui/scroll-area";
    import type { ScrollAreaRootProps } from 'bits-ui';
    import { LRC } from 'lrclib.js';
    import { cn } from '$lib/helpers/utils';
    import { Button } from '@/components/ui/button';
    import type { ClassValue } from 'clsx';
    import { settings } from '../../../helpers/classes/Settings.svelte';
    import { Skeleton } from '../../ui/skeleton';

    let {
        lyrics,
        currentTime = $bindable(0),
        ...props
    }: {
        lyrics: string;
        currentTime: number;
		scrollbarXClasses?: ClassValue;
		scrollbarYClasses?: ClassValue;
    } & ScrollAreaRootProps = $props();

    let lines = $derived(LRC.parse(lyrics).filter(l => l.type === LRC.LineType.LYRIC));
    let activeLines = $derived(LRC.getActiveLyrics(lines, currentTime * 1000));
    let container: HTMLDivElement|null = $state(null);
</script>

<ScrollArea
    {...props}
    bind:ref={container}
    class={cn(props.class)}
    scrollbarYClasses={cn(props.scrollbarYClasses, "[&>div]:bg-current/50")}
    scrollbarXClasses={cn(props.scrollbarXClasses, "[&>div]:bg-current/50")}
>
    <div class="grid gap-4">
        <div class="h-20"></div>
        {#each lines as line (line.lineNumber)}
            {@const words = line.content.trim().split(' ')}
            {@const active = activeLines.lines.find(l => l.line.lineNumber === line.lineNumber)}
            {@const sung = !active && line.startMillisecond < currentTime * 1000}
            {@const time = line.startMillisecond / 1000}
            <button
                onclick={() => currentTime = time}
                class={cn(
                    "w-full text-start flex flex-wrap space-x-2 -space-y-2 transition-all",
                    settings.prefersReducedMotion ? "duration-0" : "duration-200",
                )}
            >
                {#if words.length}
                    {#each words as word, i}
                        <span
                            class={cn(
                                "transition-[filter,translate,opacity,color] ease-out",
                                !settings.prefersReducedTransparency && "blur-[2px]",
                                settings.prefersReducedMotion
                                    ? "duration-0"
                                    : [
                                        "duration-500",
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