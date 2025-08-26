<script lang="ts">
    import type { PlayerTrack } from '$lib/helpers/classes/PlayerTrack.svelte';
    import { resolve } from '$app/paths';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { Button } from '@/components/ui/button';
    import { CircleMinusIcon, LoaderIcon, PlayIcon } from '@lucide/svelte';
    import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

    let {
        track,
        index
    }: {
        track: PlayerTrack;
        index: number;
    } = $props();

    let coverURL = $derived(track?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<div class="flex gap-2 p-2 bg-card border rounded-xl items-center">
    <a href={resolve('/(main)/player')} onclick={() => player.skip(index)} class="size-10 relative overflow-hidden rounded-lg shrink-0 hover:[&>div]:block">
        <div class="size-full absolute bg-background/60" class:hidden={!track.status}>
            {#if track.status === 'fetching'}
                <LoaderIcon class="size-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground animate-spin"/>
            {:else}
                <PlayIcon class="size-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground animate-in zoom-in-90" fill="currentColor"/>
            {/if}
        </div>
        <img src={coverURL} class="size-full object-cover object-center" alt="">
    </a>
    <button onclick={() => player.skip(index)} class="grid w-full text-start cursor-grab">
        <h3 class="text-sm font-semibold leading-tight truncate">{track?.title}</h3>
        <p class="text-xs leading-tight text-muted-foreground truncate">
            {[track?.artist, track?.album].filter(Boolean).join(' • ')}
        </p>
    </button>
    <Tooltip>
        <TooltipTrigger>
            {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon" class="size-8 text-muted-foreground rounded-full" onclick={() => player.queue = player.queue.filter((_, i) => i !== index)}>
                    <CircleMinusIcon/>
                </Button>
            {/snippet}
        </TooltipTrigger>
        <TooltipContent>Remove from queue</TooltipContent>
    </Tooltip>
</div>