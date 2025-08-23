<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { resolve } from '$app/paths';
    import { dndzone } from 'svelte-dnd-action';
    import { flip } from 'svelte/animate';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
</script>

<div>
    <div
        class="grid gap-2"
        use:dndzone={{
            items: player.queue,
            flipDurationMs: settings.prefersReducedMotion ? 0 : 300,
            dropTargetStyle: {},
            delayTouchStart: 500
        }}
        onconsider={e => player.queue = e.detail.items}
        onfinalize={e => player.queue = e.detail.items}
    >
        {#each player.queue as track, index (track.id)}
            {@const coverURL = track?.coverImageURL ?? `${resolve('/')}cover.png`}
            <div animate:flip={{ duration: settings.prefersReducedMotion ? 0 : 300 }} class="flex gap-2 p-2 bg-card border rounded-xl items-center" data-swapy-item={track.id}>
                <div class="size-10 overflow-hidden rounded-lg shrink-0">
                    <img src={coverURL} class="size-full object-cover" alt="">
                </div>
                <div class="grid w-full">
                    <h3 class="text-sm font-semibold leading-tight truncate">{track?.title}</h3>
                    <p class="text-xs leading-tight text-muted-foreground truncate">
                        {[track?.artist, track?.album].filter(Boolean).join(' • ')}
                    </p>
                </div>
            </div>
        {/each}
    </div>
</div>