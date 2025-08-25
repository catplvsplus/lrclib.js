<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { cn } from '$lib/helpers/utils';
    import { BoldIcon, BoltIcon, LetterTextIcon, Maximize2Icon, Music2Icon } from '@lucide/svelte';
    import { Button } from '@/components/ui/button';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { resolve } from '$app/paths';
    import { fade, slide } from 'svelte/transition';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import SyncedLyrics from './SyncedLyrics.svelte';
    import ResponsiveDialog from '../ResponsiveDialog.svelte';
    import { DialogState } from '$lib/helpers/classes/DialogState.svelte';
    import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Slider } from '@/components/ui/slider';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
    let lyricsType = $derived(
        player.playing?.syncedLyrics
        ? 'synced'
        : player.playing?.plainLyrics
            ? 'plain'
            : player.playing?.status === 'fetching'
                ? 'fetching'
                : 'instrumental'
    );

    let delay = $state(0);

    const lyricsDialogState = new DialogState({
        id: 'lyrics-settings',
    });
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
            <Button onclick={lyricsDialogState.open} size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground">
                <BoltIcon/>
            </Button>
            <Button size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground">
                <Maximize2Icon/>
            </Button>
        </CardAction>
    </CardHeader>
    {#if lyricsType === 'synced' || lyricsType === 'plain'}
        <CardContent class="relative z-20 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-relaxed overflow-hidden px-4">
            {#if lyricsType === 'plain'}
                {@const lines = player.playing?.plainLyrics?.split('\n') ?? []}
                <ScrollArea class="h-full text-2xl mask-intersect mask-b-from-90 mask-t-from-90 px-2 leading-relaxed" scrollbarYClasses="[&>div]:bg-current/50">
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
                    {delay}
                    lyrics={player.playing?.syncedLyrics ?? ''}
                    class="h-full mask-intersect mask-b-from-70 mask-t-from-70"
                />
            {/if}
        </CardContent>
    {:else}
        {@const fetching = lyricsType === 'fetching'}
        <CardContent class="relative z-20 text-center flex h-full items-center">
            <div class="w-full grid">
                <h3 class="text-3xl md:text-4xl lg:text-5xl font-extrabold">{fetching ? 'Loading...' : 'No lyrics available'}</h3>
                <p class="text-sm opacity-70 mt-1 font-semibold">{fetching ? 'Looking for the right lyrics' : "You'll have to guess this one"}</p>
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
<ResponsiveDialog dialogState={lyricsDialogState}>
    {#snippet title()}Lyrics settings{/snippet}
    {#snippet description()}Change lyrics type and delay{/snippet}
    {#snippet content({ type })}
        <div class="grid" class:px-4={type === 'drawer'}>
            <Tabs value={lyricsType} onValueChange={v => lyricsType = v} class="w-full">
                <TabsList class="w-full h-fit">
                    <TabsTrigger value={'synced'} disabled={!player.playing?.syncedLyrics} class="p-2 font-semibold data-[state=active]:text-primary">
                        <Music2Icon/>
                        Synced
                    </TabsTrigger>
                    <TabsTrigger value={'plain'} disabled={!player.playing?.plainLyrics} class="p-2 font-semibold data-[state=active]:text-primary">
                        <LetterTextIcon/>
                        Plain
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            {#if lyricsType === 'synced'}
                <div class="grid pt-2" transition:slide={{ duration: settings.prefersReducedMotion ? 0 : 300 }}>
                    <h3 class="text-sm font-bold">Lyrics Delay</h3>
                    <p class="text-xs text-muted-foreground mb-2">Adjust the delay of the lyrics when synced lyrics are displayed</p>
                    <Slider bind:value={delay} type="single" min={-5} max={5} step={0.5} class="w-full"/>
                    <p class="text-center text-xs text-muted-foreground font-medium mt-2">
                        {delay ? `${delay} seconds` : 'No delay'}
                    </p>
                </div>
            {/if}
        </div>
    {/snippet}
    {#snippet footer()}
        <Button variant="secondary" onclick={lyricsDialogState.close}>Close</Button>
    {/snippet}
</ResponsiveDialog>