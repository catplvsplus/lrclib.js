<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { cn } from '$lib/helpers/utils';
    import { BoltIcon, HeartCrackIcon, Maximize2Icon, ScanSearchIcon } from '@lucide/svelte';
    import { Button } from '@/components/ui/button';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { resolve } from '$app/paths';
    import { fade, } from 'svelte/transition';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import SyncedLyrics from './SyncedLyrics.svelte';
    import LyricsSettings, { lyricsSettingsDialogState } from './LyricsSettings.svelte';
    import type { PlayerTrack } from '$lib/helpers/classes/PlayerTrack.svelte';
    import { fullscreenLyricsDialogState } from '../player/FullscreenLyrics.svelte';
    import { Empty, EmptyDescription, EmptyTitle, EmptyMedia } from '../../ui/empty';

    let {
        track,
        ...props
    }: {
        track: PlayerTrack;
    } & HTMLAttributes<HTMLDivElement> = $props();

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
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
            <Button onclick={() => lyricsSettingsDialogState.open()} size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground">
                <BoltIcon/>
            </Button>
            <Button onclick={() => fullscreenLyricsDialogState.open()} size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground">
                <Maximize2Icon/>
            </Button>
        </CardAction>
    </CardHeader>
    {#if track.lyricsType === 'synced' || track.lyricsType === 'plain'}
        <CardContent class="relative z-20 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-relaxed overflow-hidden px-4">
            {#if track.lyricsType === 'plain'}
                {@const lines = player.playing?.plainLyrics?.split('\n') ?? []}
                <ScrollArea class="h-full text-2xl mask-intersect mask-b-from-90 mask-t-from-90 px-2 leading-relaxed" scrollbarYClasses="[&>div]:bg-current/50">
                    <div class="h-20"></div>
                    {#each lines as line}
                        <p>{line.trim()}</p>
                    {/each}
                    <div class="h-20"></div>
                </ScrollArea>
            {:else if track.lyricsType === 'synced'}
                <SyncedLyrics
                    bind:currentTime={
                        () => player.currentTime,
                        v => player.player!.currentTime = v
                    }
                    delay={settings.lyricsDelay.current}
                    lyrics={player.playing?.syncedLyrics ?? ''}
                    class="h-full mask-intersect mask-b-from-70 mask-t-from-70"
                />
            {/if}
        </CardContent>
    {:else}
        {@const fetching = track.lyricsType === 'fetching'}
        <CardContent class="relative z-20 text-center flex h-full items-center">
            <Empty class="gap-0">
                <EmptyMedia>
                    {#if fetching}
                        <ScanSearchIcon class="size-20 mx-auto"/>
                    {:else}
                        <HeartCrackIcon class="size-20 mx-auto"/>
                    {/if}
                </EmptyMedia>
                <EmptyTitle class="font-bold">{fetching ? 'Loading...' : 'No lyrics available'}</EmptyTitle>
                <EmptyDescription>{fetching ? 'Looking for the right lyrics' : "You'll have to guess this one"}</EmptyDescription>
            </Empty>
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
<LyricsSettings bind:delay={settings.lyricsDelay.current} {track}/>