<script lang="ts">
    import type { Track } from 'lrclib';
    import Badge from './ui/badge/badge.svelte';
    import { DateTime } from 'luxon';
    import { cn } from '../helpers/utils';
    import { badgeVariants } from './ui/badge';
	import { goto, pushState } from '$app/navigation';
    import Button from './ui/button/button.svelte';
    import Preview from 'lucide-svelte/icons/play';
    import { base } from '$app/paths';

    export let track: Track;

    function showModal() {
        pushState(`${base}/track?id=` + track.id, { showLyrics: track.id });
    }
</script>

<div {...$$props} class={cn("min-h-24 w-full rounded-md bg-accent/10 p-4", $$props.class)}>
    <div class="flex gap-2 items-center pb-2">
        {#if track.isSynced}
            <Button class="shrink-0 p-0 h-7 w-7 rounded-full" on:click={() => goto(`${base}/preview?id=${track.id}`)}>
                <Preview size="16"/>
            </Button>
        {/if}
        <h3 class="text-lg font-bold text-primary overflow-hidden text-ellipsis w-full" title={track.trackName}>
            <a href="{base}/track?id={track.id}" on:click|preventDefault={showModal}>
                {track.trackName}
            </a>
        </h3>
    </div>
    <p class="text-sm leading-6">
        <a class={cn(badgeVariants({ variant: 'default' }))} title={track.artistName} href="{base}/search?q={encodeURIComponent(track.artistName)}">
            {track.artistName}
        </a>
        <a class={cn(badgeVariants({ variant: 'secondary' }), "bg-foreground/15")} title={track.albumName} href="{base}/search?q={encodeURIComponent(track.albumName)}">
            {track.albumName}
        </a>
        <Badge variant="outline" class="text-primary border-primary" style={track.isSynced ? '--primary: var(--success)' : '--primary: 0 0 54%'}>
            {#if track.isSynced}
                Synced
            {:else}
                Plain
            {/if}
        </Badge>
        <Badge variant="outline" class="bg-foreground/15" title={DateTime.fromSeconds(track.duration).toFormat("m 'minutes and' s 'seconds'")}>
            {DateTime.fromSeconds(track.duration).toFormat('mm:ss')}
        </Badge>
        {#if track.instrumental}
            <Badge variant="outline" class="bg-foreground/15">Instrumental</Badge>
        {/if}
    </p>
</div>