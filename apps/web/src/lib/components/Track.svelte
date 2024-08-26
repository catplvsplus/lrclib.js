<script lang="ts">
    import type { Track } from 'lrclib';
    import Badge from './ui/badge/badge.svelte';
    import { DateTime } from 'luxon';
    import { cn } from '../helpers/utils';
    import { badgeVariants } from './ui/badge';
	import { pushState } from '$app/navigation';

    export let track: Track;

    function showModal() {
        pushState('/track?id=' + track.id, { showLyrics: track.id });
    }
</script>

<div {...$$props} class={cn("min-h-24 w-full rounded-md bg-accent/10 p-4", $$props.class)}>
    <h3 class="text-lg font-bold text-primary overflow-hidden text-ellipsis pb-2" title={track.trackName}>
        <a href="/track?id={track.id}" on:click|preventDefault={showModal}>
            {track.trackName}
        </a>
    </h3>
    <p class="text-sm leading-6">
        <a class={cn(badgeVariants({ variant: 'default' }))} title={track.artistName} href="/search?q={encodeURIComponent(track.artistName)}">
            {track.artistName}
        </a>
        <a class={cn(badgeVariants({ variant: 'secondary' }), "bg-foreground/15")} title={track.albumName} href="/search?q={encodeURIComponent(track.albumName)}">
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