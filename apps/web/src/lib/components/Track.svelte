<script lang="ts">
    import type { Track } from 'lrclib';
    import { fade } from 'svelte/transition';
    import * as Tooltip from './ui/tooltip';
    import Badge from './ui/badge/badge.svelte';
    import { DateTime } from 'luxon';
    import { cn } from '../helpers/utils';
    import { badgeVariants } from './ui/badge';

    export let track: Track;
</script>

<div class="min-h-24 w-full rounded-md bg-accent/10 p-4">
    <h3 class="text-lg font-bold text-primary overflow-hidden text-ellipsis pb-2" title={track.trackName}>
        <a href="/track/{track.id}">
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