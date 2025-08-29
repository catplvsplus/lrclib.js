<script lang="ts">
    import { onMount, untrack, type Snippet } from 'svelte';
    import { Button, type ButtonProps } from '../../ui/button';
    import { blur, fly } from 'svelte/transition';
    import { onClickOutside, PressedKeys } from 'runed';
    import { settings } from '../../../helpers/classes/Settings.svelte';
    import { cn } from '../../../helpers/utils';
    import { DialogState } from '../../../helpers/classes/DialogState.svelte';
    import { player } from '../../../helpers/classes/Player.svelte';
    import CoverBackground from './CoverBackground.svelte';
    import { resolve } from '$app/paths';
    import { EllipsisIcon, Info, InfoIcon, SettingsIcon, XIcon } from '@lucide/svelte';
    import { ScrollArea } from '../../ui/scroll-area';
    import PlayerProgressBar from './PlayerProgressBar.svelte';
    import PlayerControls from './PlayerControls.svelte';
    import SyncedLyrics from '../preview/SyncedLyrics.svelte';
    import { MediaQuery } from 'svelte/reactivity';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
    import { pl } from 'zod/locales';
    import { goto } from '$app/navigation';
    import { lyricsSettingsDialogState } from '../preview/LyricsSettings.svelte';

    let {
        children
    }: {
        children?: Snippet<[{ props: ButtonProps; }]>;
        fullscreenWindow?: boolean;
    } = $props();

    let container: HTMLDivElement|null = $state(null);
    let screenHalf: number = $state(0);

    const pressedKeys = new PressedKeys();

    $effect(() => {
        if (fullscreenLyricsDialogState.isOpen !== fullscreenLyricsDialogState.isActive) {
            fullscreenLyricsDialogState.toggle(fullscreenLyricsDialogState.isActive);
        }
    });

    pressedKeys.onKeys('Escape', () => fullscreenLyricsDialogState.isOpen && fullscreenLyricsDialogState.close());

    onClickOutside(() => container, () => fullscreenLyricsDialogState.isOpen && fullscreenLyricsDialogState.close());

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
    let title = $derived(player.playing?.title ?? 'Unknown Title');
    let description = $derived([player.playing?.artist, player.playing?.album].filter(Boolean).join(' • ') || 'Unknown Artist');

    const isScreenLg = new MediaQuery(`(min-width: 64rem)`);

    onMount(() => {
        screenHalf = window.innerHeight / 3;
    });
</script>

<script module>
    export let fullscreenLyricsDialogState = new DialogState({
        id: 'fullscreen-lyrics'
    });
</script>

<svelte:window onresize={() => screenHalf = window.innerHeight / 3}/>

{@render children?.({
    props: {
        onclick: () => fullscreenLyricsDialogState.open()
    }
})}

{#if fullscreenLyricsDialogState.isOpen}
    <style>
        html {
            overflow: hidden;
            pointer-events: none;
        }

        html,
        body {
            overscroll-behavior-y: contain;
        }
    </style>
    <div
        class={cn(
            "h-full w-full fixed top-0 left-0 pointer-events-auto z-50 bg-background",
            !settings.prefersReducedTransparency && "dark text-foreground"
        )}
        transition:fly={{ y: window.innerHeight, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
        bind:this={container}
    >
        <CoverBackground track={player.playing}/>
        <div class="container absolute left-1/2 -translate-x-1/2 h-full w-full z-10 flex flex-col lg:flex-row lg:gap-10 lg:justify-center">
            <div class="flex shrink-0 h-fit lg:h-full lg:w-md xl:w-2xl lg:justify-center items-center p-4 gap-2 w-full lg:flex-col lg:gap-5 overflow-hidden">
                <div class="size-15 lg:size-96 xl:size-[32rem] overflow-hidden relative rounded-lg shadow-lg shrink-0">
                    {#key coverURL}
                        <img class="size-full object-coverobject-center absolute top-0 left-0" src={coverURL} alt="" transition:blur>
                    {/key}
                </div>
                <div class="flex flex-col justify-center w-full overflow-hidden lg:text-center lg:max-w-lg">
                    <h3 title={title} class="text-base lg:text-3xl font-semibold lg:font-extrabold truncate">{title}</h3>
                    <p title={description} class="text-xs lg:text-sm leading-tight font-medium text-foreground/70 truncate">{description}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        {#snippet child({ props })}
                            <Button {...props} size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground lg:hidden">
                                <EllipsisIcon class="size-5!"/>
                            </Button>
                        {/snippet}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="min-w-40 font-medium">
                        <DropdownMenuItem onclick={() => fullscreenLyricsDialogState.close()}>
                            <XIcon/>
                            Close
                        </DropdownMenuItem>
                        <DropdownMenuItem onclick={() => lyricsSettingsDialogState.open()}>
                            <SettingsIcon/>
                            Lyrics Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onclick={() => goto(player.playing?.lyrics ?`${resolve('/(main)/track/[id]', { id: player.playing.id })}` : '')} disabled={!player.playing?.lyrics}>
                            <InfoIcon/>
                            Lyrics Info
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div class="w-full max-w-lg gap-2 pt-2 hidden lg:grid">
                    <PlayerProgressBar/>
                    <PlayerControls class="w-full justify-center"/>
                </div>
            </div>
            <div class="h-full w-full relative z-20 text-4xl lg:text-5xl font-extrabold leading-relaxed overflow-hidden px-4 lg:w-lg xl:w-2xl">
                {#if player.playing?.lyricsType === 'plain'}
                    {@const lines = player.playing?.plainLyrics?.split('\n') ?? []}
                    <ScrollArea class="h-full text-2xl mask-intersect mask-b-from-95% mask-t-from-95% px-2 leading-relaxed" scrollbarYClasses="[&>div]:bg-current/50">
                        <div class="h-20"></div>
                        {#each lines as line}
                            <p>{line.trim()}</p>
                        {/each}
                        <div class="h-20"></div>
                    </ScrollArea>
                {:else if player.playing?.lyricsType === 'synced'}
                    <SyncedLyrics
                        bind:currentTime={
                            () => player.currentTime,
                            v => player.player!.currentTime = v
                        }
                        delay={settings.lyricsDelay.current}
                        lyrics={player.playing?.syncedLyrics ?? ''}
                        scrollAlign="start"
                        scrollMargin={isScreenLg.current ? -screenHalf : -40}
                        hideSung
                        class="h-full mask-intersect mask-b-from-0 sm:mask-b-from-50% mask-t-from-95%"
                    >
                        {#snippet padding(type)}
                            <div class="pb-[30dvh]"></div>
                        {/snippet}
                    </SyncedLyrics>
                {:else}
                    {@const fetching = player.playing?.lyricsType === 'fetching'}
                    <div class="relative z-20 text-center flex h-full items-center">
                        <div class="w-full grid">
                            <h3 class="text-3xl md:text-4xl lg:text-5xl font-extrabold">{fetching ? 'Loading...' : 'No lyrics available'}</h3>
                            <p class="text-sm opacity-70 mt-1 font-semibold">{fetching ? 'Looking for the right lyrics' : "You'll have to guess this one"}</p>
                        </div>
                    </div>
                {/if}
            </div>
            <div class="grid gap-2 p-5 pt-2 lg:hidden">
                <PlayerProgressBar/>
                <PlayerControls class="w-full justify-center"/>
            </div>
        </div>
    </div>
{/if}