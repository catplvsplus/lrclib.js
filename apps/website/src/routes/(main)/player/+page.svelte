<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { onMount } from 'svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import { resolve } from '$app/paths';
    import QueueCard from '$lib/components/shared/queue/QueueCard.svelte';

    onMount(() => {
        userInterface.playerMode = 'hidden';

        return () => {
            userInterface.playerMode = 'visible';
        };
    });

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-2 w-full">
    <div class="grid gap-2 xl:col-span-2">
    </div>
    <QueueCard/>
</div>