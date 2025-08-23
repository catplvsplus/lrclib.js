<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { Button } from '@/components/ui/button';
    import { SkipBackIcon, PauseIcon, PlayIcon, SkipForwardIcon } from '@lucide/svelte';
    import FlyInOut from '../FlyInOut.svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { cn } from '$lib/helpers/utils';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...props} class={cn("flex items-center gap-2 mt-2", props.class)}>
    <Button
        size="icon"
        variant="secondary"
        class="size-11 rounded-full overflow-hidden relative bg-transparent hover:bg-foreground/20"
        onclick={() => player.previous()}
        disabled={!player.previousable}
    >
        <SkipBackIcon fill="currentColor" class="size-5"/>
    </Button>
    <Button
        size="icon"
        variant="secondary"
        class="size-16 rounded-full overflow-hidden relative bg-foreground/15 hover:bg-foreground/20"
        onclick={() => player.status === 'playing' ? player.pause() : player.play()}
        disabled={player.status !== 'playing' && player.status !== 'paused'}
    >
        {#if player.status === 'playing'}
            <FlyInOut inY={70} outY={-70}>
                <PauseIcon fill="currentColor" class="size-8"/>
            </FlyInOut>
        {:else}
            <FlyInOut inY={70} outY={-70}>
                <PlayIcon fill="currentColor" class="size-8"/>
            </FlyInOut>
        {/if}
    </Button>
    <Button
        size="icon"
        variant="secondary"
        class="size-11 rounded-full overflow-hidden relative bg-transparent hover:bg-foreground/20"
        onclick={() => player.skip()}
        disabled={!player.skippable}
    >
        <SkipForwardIcon fill="currentColor" class="size-5"/>
    </Button>
</div>