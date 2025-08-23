<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { resolve } from '$app/paths';
    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { Button } from '../../ui/button';
    import { CircleMinusIcon, PlayIcon } from '@lucide/svelte';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
    import type { HTMLAttributes } from 'svelte/elements';
    import { cn } from '$lib/helpers/utils';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
    {...props}
    class={cn("grid gap-2", props.class)}
    use:dndzone={{
        items: player.queue,
        flipDurationMs: settings.prefersReducedMotion ? 0 : 300,
        dropTargetStyle: {},
        delayTouchStart: 200
    }}
    onconsider={e => player.queue = e.detail.items}
    onfinalize={e => player.queue = e.detail.items}
>
    {#each player.queue as track, index (track.id)}
        {@const coverURL = track?.coverImageURL ?? `${resolve('/')}cover.png`}
        <div animate:flip={{ duration: settings.prefersReducedMotion ? 0 : 300 }} class="flex gap-2 p-2 bg-card border rounded-xl items-center">
            <a href={resolve('/(main)/player')} onclick={() => player.skip(index)} class="size-10 relative overflow-hidden rounded-lg shrink-0 hover:[&>div]:block">
                <div class="size-full absolute bg-background/10 hidden">
                    <PlayIcon class="size-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground animate-in zoom-in-90" fill="currentColor"/>
                </div>
                <img src={coverURL} class="size-full object-cover" alt="">
            </a>
            <a href={resolve('/(main)/player')} onclick={() => player.skip(index)} class="grid w-full">
                <h3 class="text-sm font-semibold leading-tight truncate">{track?.title}</h3>
                <p class="text-xs leading-tight text-muted-foreground truncate">
                    {[track?.artist, track?.album].filter(Boolean).join(' • ')}
                </p>
            </a>
            <Tooltip>
                <TooltipTrigger>
                    {#snippet child({ props })}
                        <Button {...props} variant="ghost" size="icon" class="size-8 text-muted-foreground rounded-full" onclick={() => player.queue = player.queue.filter((_, i) => i !== index)}>
                            <CircleMinusIcon/>
                        </Button>
                    {/snippet}
                    <TooltipContent>Remove from queue</TooltipContent>
                </TooltipTrigger>
            </Tooltip>
        </div>
    {/each}
</div>