<script lang="ts">
    import { onMount } from 'svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import QueueCard from '$lib/components/shared/queue/QueueCard.svelte';
    import PlayerCard from '@/components/shared/player/PlayerCard.svelte';
    import { cn } from '$lib/helpers/utils';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import PreviewCard from '$lib/components/shared/preview/PreviewCard.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { fullscreenLyricsDialogState } from '@/components/shared/player/FullscreenLyrics.svelte';
    import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty/index.js';
    import { BoomBoxIcon, CirclePlusIcon, MusicIcon } from '@lucide/svelte';
    import { Button } from '../../../lib/components/ui/button';

    onMount(() => {
        userInterface.playerMode = 'hidden';

        return () => {
            userInterface.playerMode = 'visible';
        };
    });
</script>

<MetaTags
    title="Lrclib.js | {player.playing ? `Now playing ${player.playing.title}` : 'Player'}"
/>

{#if !fullscreenLyricsDialogState.isOpen}
    {#if player.playing}
        <div class="grid gap-2 w-full">
            <PlayerCard/>
            <QueueCard
                class={cn(
                    "h-fit",
                    userInterface.playerMenu !== 'queue' && "hidden"
                )}
            />
            <PreviewCard
                track={player.playing}
                class={cn(
                    userInterface.playerMenu !== 'lyrics' && "hidden"
                )}
            />
        </div>
    {:else}
        <Empty class="h-full gap-0">
            <EmptyMedia>
                <BoomBoxIcon class="size-20 mx-auto"/>
            </EmptyMedia>
            <EmptyTitle class="font-bold">Queue is empty</EmptyTitle>
            <EmptyDescription>Add audio files to the queue to start playing</EmptyDescription>
            <EmptyContent class="mt-4">
                <Button variant="secondary" onclick={() => player.filesInput?.click()}>
                    <CirclePlusIcon/>
                    Play from file
                </Button>
            </EmptyContent>
        </Empty>
    {/if}
{/if}