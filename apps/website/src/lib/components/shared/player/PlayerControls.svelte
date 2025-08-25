<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { Button } from '@/components/ui/button';
    import { SkipBackIcon, PauseIcon, PlayIcon, SkipForwardIcon, ListMusicIcon, MicVocalIcon } from '@lucide/svelte';
    import FlyInOut from '../FlyInOut.svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { cn } from '$lib/helpers/utils';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...props} class={cn("flex items-center gap-4 md:gap-2 mt-2", props.class)}>
    <Tooltip>
        <TooltipTrigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    size="icon"
                    variant="secondary"
                    class="size-11 rounded-full overflow-hidden relative bg-transparent hover:bg-foreground/20"
                    onclick={() => player.previous()}
                    disabled={!player.previousable}
                >
                    <SkipBackIcon fill="currentColor" class="size-5"/>
                </Button>
            {/snippet}
        </TooltipTrigger>
        <TooltipContent>Previous</TooltipContent>
    </Tooltip>
    <Tooltip>
        <TooltipTrigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    size="icon"
                    variant="secondary"
                    class="size-16 rounded-full bg-foreground/15 hover:bg-foreground/20"
                    onclick={() => player.status === 'playing' ? player.pause() : player.play()}
                    disabled={player.status !== 'playing' && player.status !== 'paused'}
                >
                    {#if player.status === 'playing'}
                        <PauseIcon fill="currentColor" class="size-8"/>
                    {:else}
                        <PlayIcon fill="currentColor" class="size-8"/>
                    {/if}
                </Button>
            {/snippet}
        </TooltipTrigger>
        <TooltipContent>{player.status === 'playing' ? 'Pause' : 'Play'}</TooltipContent>
    </Tooltip>
    <Tooltip>
        <TooltipTrigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    size="icon"
                    variant="secondary"
                    class="size-11 rounded-full overflow-hidden relative bg-transparent hover:bg-foreground/20"
                    onclick={() => player.skip()}
                    disabled={!player.skippable}
                >
                    <SkipForwardIcon fill="currentColor" class="size-5"/>
                </Button>
            {/snippet}
        </TooltipTrigger>
        <TooltipContent>Next</TooltipContent>
    </Tooltip>
</div>