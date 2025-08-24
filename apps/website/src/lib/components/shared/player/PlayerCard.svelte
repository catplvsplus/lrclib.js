<script lang="ts">
    import { Card, CardContent } from "@/components/ui/card";
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { resolve } from '$app/paths';
    import { blur, fade } from 'svelte/transition';
    import { cn } from '$lib/helpers/utils';
    import PlayerControls from './PlayerControls.svelte';
    import PlayerProgressBar from './PlayerProgressBar.svelte';
    import { settings } from '../../../helpers/classes/Settings.svelte';
    import { AspectRatio } from '../../ui/aspect-ratio';

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<Card
    class={cn(
        "h-fit z-10 relative overflow-hidden"
    )}
>
    <CardContent class="flex gap-5 items-center relative z-10 flex-col xl:flex-row">
        <div class="w-full xl:w-60 max-w-96 shrink-0">
            <AspectRatio class="overflow-hidden rounded-lg relative shadow">
                {#key coverURL}
                    <img src={coverURL} alt="" class="size-full object-cover object-center absolute" transition:blur={{ duration: settings.prefersReducedMotion ? 0 : 300 }}>
                {/key}
            </AspectRatio>
        </div>
        <div class="grid gap-6 h-fit w-full max-w-96" class:dark={!settings.prefersReducedTransparency}>
            <div class="grid text-center xl:text-start">
                <h3 class="text-2xl xl:text-4xl text-foreground font-bold leading-tight truncate whitespace-normal line-clamp-2">{player.playing?.title}</h3>
                <p class="text-base xl:text-lg text-foreground/70 truncate whitespace-normal line-clamp-2">{[player.playing?.artist, player.playing?.album].filter(Boolean).join(' • ')}</p>
            </div>
            <div class="grid gap-2">
                <PlayerProgressBar/>
                <PlayerControls class="justify-center"/>
            </div>
        </div>
    </CardContent>
    <div
        class="size-full absolute top-0 left-0 -z-10 overflow-hidden"
        class:hidden={settings.prefersReducedTransparency}
    >
        <div class="absolute size-full backdrop-blur-3xl backdrop-saturate-150 z-10 bg-black/50 dark:bg-black/10"></div>
        {#key coverURL}
            <div
                class="size-full scale-125 top-1/2 left-1/2 -translate-1/2 object-cover absolute dark:opacity-30"
                style="background-image: url({coverURL})"
                transition:fade={{ duration: settings.prefersReducedMotion ? 0 : 300 }}
            >
            </div>
        {/key}
    </div>
</Card>