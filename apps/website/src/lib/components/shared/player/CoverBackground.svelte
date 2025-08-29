<script lang="ts">
    import type { PlayerTrack } from '$lib/helpers/classes/PlayerTrack.svelte';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { fade } from 'svelte/transition';
    import { resolve } from '$app/paths';

    let {
        track
    }: {
        track?: PlayerTrack|null;
    } = $props();

    let coverURL = $derived(track?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<div
    class="size-full absolute top-0 left-0 -z-10 overflow-hidden"
    class:hidden={settings.prefersReducedTransparency || !player.playing}
>
    <div class="absolute size-full backdrop-blur-3xl backdrop-saturate-150 z-10 bg-black/50"></div>
    {#key coverURL}
        <div
            class="size-full scale-125 bg-cover bg-center absolute"
            style="background-image: url({coverURL})"
            transition:fade={{ duration: settings.prefersReducedMotion ? 0 : 300 }}
        >
        </div>
    {/key}
</div>