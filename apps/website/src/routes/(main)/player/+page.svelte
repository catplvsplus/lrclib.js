<script lang="ts">
    import { onMount } from 'svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import QueueCard from '$lib/components/shared/queue/QueueCard.svelte';
    import PlayerCard from '@/components/shared/player/PlayerCard.svelte';
    import { cn } from '$lib/helpers/utils';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import PreviewCard from '$lib/components/shared/preview/PreviewCard.svelte';
    import { MetaTags } from 'svelte-meta-tags';

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

<div class="grid gap-2 w-full">
    <PlayerCard/>
    {#if player.playing}
        <QueueCard
            class={cn(
                "h-fit",
                userInterface.playerMenu !== 'queue' && "hidden"
            )}
        />
        <PreviewCard
            class={cn(
                userInterface.playerMenu !== 'lyrics' && "hidden"
            )}
        />
    {/if}
</div>