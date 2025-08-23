<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import Queue from '@/components/shared/queue/QueueList.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    import { ListMusicIcon, PlayIcon } from '@lucide/svelte';
    import { Skeleton } from '$lib/components/ui/skeleton';
    import { formatBytesString, formatDurationString } from '$lib/helpers/utils';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import QueueParsingList from './QueueParsingList.svelte';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();

    let fileInput: HTMLInputElement|null = $state(null);
</script>

<Card {...props}>
    <CardHeader>
        <CardTitle class="flex items-center gap-1">
            <ListMusicIcon class="size-5 text-primary"/>
            Queue
        </CardTitle>
        <CardDescription class="relative overflow-hidden">
            {#if !player.queue.length}
                No tracks in queue
            {:else}
                {player.queue.length} track{player.queue.length > 1 ? 's' : ''} • {formatDurationString(player.queue.reduce((acc, track) => acc + (track.duration ?? 0), 0) * 1000)}
            {/if}
        </CardDescription>
        <CardAction>
            <Button variant="outline" onclick={() => fileInput?.click()} class="relative overflow-hidden">
                <PlayIcon/>
                Add Track
            </Button>
        </CardAction>
    </CardHeader>
    {#if player.queue.length || player.filesParsing.length}
        <CardContent class="grid gap-2">
            {#if player.queue.length}
                <Queue/>
            {/if}
            {#if player.filesParsing.length}
                <QueueParsingList/>
            {/if}
        </CardContent>
    {/if}
</Card>
<input type="file" accept="audio/*" multiple onchange={e => e.currentTarget.files && player.addTracksFromFiles(e.currentTarget.files)} bind:this={fileInput} style="display: none"/>