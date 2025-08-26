<script lang="ts">
    import type { Snippet } from 'svelte';
    import { Button, type ButtonProps } from '../../ui/button';
    import { blur, fly } from 'svelte/transition';
    import { onClickOutside, PressedKeys } from 'runed';
    import { settings } from '../../../helpers/classes/Settings.svelte';
    import { cn } from '../../../helpers/utils';
    import { DialogState } from '../../../helpers/classes/DialogState.svelte';
    import { player } from '../../../helpers/classes/Player.svelte';
    import CoverBackground from './CoverBackground.svelte';
    import { resolve } from '$app/paths';
    import { EllipsisIcon } from '@lucide/svelte';
    import { ScrollArea } from '../../ui/scroll-area';
    import PlayerProgressBar from './PlayerProgressBar.svelte';
    import PlayerControls from './PlayerControls.svelte';
    import QueueLyricsToggle from './QueueLyricsToggle.svelte';
    import SyncedLyrics from '../preview/SyncedLyrics.svelte';

    let {
        children
    }: {
        children?: Snippet<[{ props: ButtonProps; }]>;
    } = $props();

    let container: HTMLDivElement|null = $state(null);

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
</script>

<script module>
    export let fullscreenLyricsDialogState = new DialogState({
        id: 'fullscreen-lyrics'
    });
</script>

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
            "h-full w-full fixed top-0 left-0 pointer-events-auto z-[60] bg-background",
            !settings.prefersReducedTransparency && "dark text-foreground"
        )}
        transition:fly={{ y: window.innerHeight, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
        bind:this={container}
    >
        <CoverBackground track={player.playing}/>
        <div class="relative h-full w-full flex flex-col z-10">
            <div class="flex shrink-0 h-fit items-center p-4 gap-2 w-full overflow-hidden">
                <div class="size-15 overflow-hidden relative rounded-lg shadow-lg shrink-0">
                    {#key coverURL}
                        <img class="size-full object-coverobject-center absolute top-0 left-0" src={coverURL} alt="" transition:blur>
                    {/key}
                </div>
                <div class="flex flex-col justify-center w-full overflow-hidden">
                    <h3 title={title} class="text-base font-semibold truncate">{title}</h3>
                    <p title={description} class="text-xs leading-tight font-medium text-foreground/70 truncate">{description}</p>
                </div>
                <Button size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground">
                    <EllipsisIcon class="size-5!"/>
                </Button>
            </div>
            <div class="flex-grow h-full w-full relative z-20 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-relaxed overflow-hidden px-4">
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
                        scrollMargin={-40}
                        class="h-full mask-intersect mask-b-from-95% mask-t-from-95%"
                    />
                {/if}
            </div>
            <div class="grid gap-2 p-5 pt-2">
                <PlayerProgressBar/>
                <PlayerControls class="w-full justify-center"/>
            </div>
        </div>
    </div>
{/if}