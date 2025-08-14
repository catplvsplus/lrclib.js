<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { player } from '$lib/helpers/classes/Player.svelte';

    onMount(() => {
        player.initialize();
    });

    onDestroy(() => {
        player.destroy();
    });
</script>