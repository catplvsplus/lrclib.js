<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { cn } from '$lib/helpers/utils';
    import QueueItem from './QueueItem.svelte';

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
        <div animate:flip={{ duration: settings.prefersReducedMotion ? 0 : 300 }}>
            <QueueItem {track} {index}/>
        </div>
    {/each}
</div>