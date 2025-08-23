<script lang="ts">
    import { Card, CardContent } from "@/components/ui/card";
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { resolve } from '$app/paths';
    import { blur, fade } from 'svelte/transition';
    import { cn } from '$lib/helpers/utils';
    import PlayerControls from './PlayerControls.svelte';
    import PlayerProgressBar from './PlayerProgressBar.svelte';

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<Card
    class={cn(
        "h-fit z-10 relative overflow-hidden"
    )}
>
    <CardContent class="flex gap-5 items-center relative z-10">
        <div class="size-60 shrink-0 overflow-hidden rounded-lg relative shadow">
            {#key coverURL}
                <img src={coverURL} alt="" class="size-full object-cover absolute" transition:blur>
            {/key}
        </div>
        <div class="grid gap-6 h-fit w-full">
            <div class="grid">
                <h3 class="text-4xl font-bold leading-tight truncate whitespace-normal line-clamp-2">{player.playing?.title}</h3>
                <p class="text-lg text-foreground/70">{[player.playing?.artist, player.playing?.album].filter(Boolean).join(' • ')}</p>
            </div>
            <div class="grid gap-1">
                <PlayerProgressBar/>
                <PlayerControls class="justify-center"/>
            </div>
        </div>
    </CardContent>
    <div class="size-full absolute top-0 left-0 -z-10 overflow-hidden">
        {#key coverURL}
            <img src={coverURL} alt="" class="size-full top-1/2 left-1/2 -translate-1/2 object-cover absolute blur-3xl opacity-40 saturate-150" transition:fade>
        {/key}
    </div>
</Card>