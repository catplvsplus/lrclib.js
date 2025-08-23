<script lang="ts">
    import { onMount } from 'svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import QueueCard from '$lib/components/shared/queue/QueueCard.svelte';
    import PlayerCard from '@/components/shared/player/PlayerCard.svelte';

    onMount(() => {
        userInterface.playerMode = 'hidden';

        return () => {
            userInterface.playerMode = 'visible';
        };
    });
</script>

<div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-2 w-full">
    <div class="grid gap-2 xl:col-span-2">
        <PlayerCard/>
    </div>
    <QueueCard/>
</div>