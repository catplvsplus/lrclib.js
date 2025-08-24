<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
    import Queue from '@/components/shared/queue/QueueList.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    import { CirclePlusIcon, ListMusicIcon, Trash2Icon, TrashIcon, BrushCleaningIcon, XIcon, FlameIcon, ShuffleIcon } from '@lucide/svelte';
    import { formatDurationString } from '$lib/helpers/utils';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import QueueParsingList from './QueueParsingList.svelte';
    import ResponsiveDialog from '../ResponsiveDialog.svelte';
    import { DialogState } from '../../../helpers/classes/DialogState.svelte';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();

    let fileInput: HTMLInputElement|null = $state(null);

    const clearQueueDialog = new DialogState({
        id: 'clear-queue'
    });
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
                <CirclePlusIcon/>
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
        {#if player.queue.length}
            <CardFooter class="flex justify-end gap-2">
                <Button variant="outline" class="font-semibold" onclick={() => player.queue = player.queue.sort(() => Math.random() - 0.5)}>
                    <ShuffleIcon/>
                    Shuffle
                </Button>
                <Button variant="destructive" class="font-semibold" onclick={clearQueueDialog.open}>
                    <TrashIcon/>
                    Clear All
                </Button>
            </CardFooter>
        {/if}
    {/if}
</Card>
<input type="file" accept="audio/*" multiple onchange={e => e.currentTarget.files && player.addTracksFromFiles(e.currentTarget.files)} bind:this={fileInput} style="display: none"/>
<ResponsiveDialog dialogState={clearQueueDialog}>
    {#snippet title()}
        Warning
    {/snippet}
    {#snippet description()}
        This action will remove all tracks from the queue. Are you sure you want to remove all tracks?
    {/snippet}
    {#snippet footer()}
        <Button variant="outline" class="font-semibold" onclick={clearQueueDialog.close}>
            Cancel
        </Button>
        <Button
            variant="destructive"
            onclick={() => {
                player.clear();
                clearQueueDialog.close();
            }}
            disabled={!player.queue.length}
        >
            Clear Queue
        </Button>
    {/snippet}
</ResponsiveDialog>