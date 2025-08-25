<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../../ui/card';
    import { cn } from '../../../helpers/utils';
    import { Maximize2Icon } from '@lucide/svelte';
    import { Button } from '../../ui/button';
    import { player } from '../../../helpers/classes/Player.svelte';
    import { settings } from '../../../helpers/classes/Settings.svelte';
    import { resolve } from '$app/paths';
    import { fade } from 'svelte/transition';
    import { ScrollArea } from '../../ui/scroll-area';
    import SyncedLyrics from './SyncedLyrics.svelte';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
    let lyricsType = $derived(player.playing?.syncedLyrics ? 'synced' : player.playing?.plainLyrics ? 'plain' : 'instrumental');
</script>

<Card
    {...props}
    class={cn(
        'relative overflow-hidden h-96 min-h-96 sm:h-[500px] gap-4',
        !settings.prefersReducedTransparency && 'dark',
        props.class
    )}
>
    <CardHeader class="flex items-center justify-between relative z-20">
        <CardTitle class="text-lg font-bold">Lyrics</CardTitle>
        <CardAction>
            <Button onclick={() => lyricsType = lyricsType === 'synced' ? 'plain' : 'synced'} size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground">
                <Maximize2Icon/>
            </Button>
        </CardAction>
    </CardHeader>
    {#if lyricsType !== 'instrumental'}
        <CardContent class="relative z-20 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-relaxed overflow-hidden">
            {#if lyricsType === 'plain'}
                {@const lines = player.playing?.plainLyrics?.split('\n') ?? []}
                <ScrollArea class="h-full text-2xl mask-intersect mask-b-from-90 mask-t-from-90" scrollbarYClasses="[&>div]:bg-current/50">
                    <div class="h-20"></div>
                    {#each lines as line}
                        <p>{line.trim()}</p>
                    {/each}
                    <div class="h-20"></div>
                </ScrollArea>
            {:else if lyricsType === 'synced'}
                <SyncedLyrics
                    bind:currentTime={
                        () => player.currentTime,
                        v => player.player!.currentTime = v
                    }
                    lyrics={player.playing?.syncedLyrics ?? ''}
                    class="h-full mask-intersect mask-b-from-70 mask-t-from-70"
                />
            {/if}
        </CardContent>
    {:else}
        <CardContent class="relative z-20 text-center flex h-full items-center">
            <div class="w-full grid">
                <h3 class="text-3xl md:text-4xl lg:text-5xl font-extrabold">No lyrics available</h3>
                <p class="text-sm opacity-70 mt-1 font-semibold">You'll have to guess this one</p>
            </div>
        </CardContent>
    {/if}
    <div
        class="size-full absolute top-0 left-0 overflow-hidden"
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
</Card>