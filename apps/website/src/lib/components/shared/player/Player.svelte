<script lang="ts">
    import { untrack } from 'svelte';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { blur, fade, fly, scale } from 'svelte/transition';
    import { resolve } from '$app/paths';
    import { Button } from '@/components/ui/button';
    import { PlayIcon, PauseIcon } from '@lucide/svelte';
    import FlyInOut from '../FlyInOut.svelte';
    import { cn } from '$lib/helpers/utils';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';

    $effect(() => {
        if (untrack(() => !('mediaSession' in navigator))) return;

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: player.playing?.title,
                artist: player.playing?.artist,
                album: player.playing?.album,
                artwork: [
                    { src: player.playing?.coverImageURL ?? `${resolve('/')}cover.png` }
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => player.play());
            navigator.mediaSession.setActionHandler('pause', () => player.pause());
            navigator.mediaSession.setActionHandler('previoustrack', player.previousable ? (() => player.previous()) : null);
            navigator.mediaSession.setActionHandler('nexttrack', player.skippable ? (() => player.skip()) : null);
            navigator.mediaSession.setActionHandler('stop', player.playing ? () => player.stop() : null);
        }
    });
</script>

{#if player.playing && userInterface.playerMode === 'visible'}
    {@const title = player.playing.title}
    {@const description = [player.playing.artist, player.playing.album].filter(Boolean).join(' • ')}
    {@const coverURL = player.playing.coverImageURL ?? `${resolve('/')}cover.png`}
    <div
        class={cn([
            "fixed right-0 w-full max-w-sm z-30 transition-all duration-300",
            userInterface.menuMode === 'bottom' ? "bottom-17 max-w-md" : "bottom-0",
            "sm:bottom-0"
        ])}
        transition:fly={{ y: 200 }}
    >
        <div
            class={cn(
                settings.prefersReducedTransparency ? "bg-card" : "bg-card/85 backdrop-blur-sm backdrop-saturate-150",
                "border rounded-xl p-2 pb-2.5 shadow flex items-center gap-2 relative overflow-hidden",
                userInterface.menuMode === 'bottom' ? "m-2" : "m-4",
                "sm:m-4"
            )}
        >
            <a href={resolve('/(main)/player')} class="size-12 overflow-hidden rounded-sm shrink-0 relative">
                {#key coverURL}
                    <img class="size-full object-cover absolute top-0 left-0" src={coverURL} alt="" transition:blur>
                {/key}
            </a>
            <a href={resolve('/(main)/player')} class="flex flex-col justify-center w-full whitespace-nowrap overflow-hidden">
                <h3 title={title} class="text-base font-semibold text-ellipsis overflow-clip">{title}</h3>
                <p title={description} class="text-xs leading-tight text-muted-foreground text-ellipsis overflow-clip">{description}</p>
            </a>
            <div class="shrink-0 size-10">
                <Button
                    size="icon"
                    class="size-10 rounded-full overflow-hidden relative bg-secondary/50"
                    variant="secondary"
                    onclick={() => player.status === 'playing' ? player.pause() : player.play()}
                    disabled={player.status !== 'playing' && player.status !== 'paused'}
                >
                    {#if player.status === 'paused'}
                        <FlyInOut inY={40} outY={-40}>
                            <PlayIcon fill="currentColor"/>
                        </FlyInOut>
                    {:else if player.status === 'playing'}
                        <FlyInOut inY={40} outY={-40}>
                            <PauseIcon fill="currentColor"/>
                        </FlyInOut>
                    {/if}
                </Button>
            </div>
            <div class="absolute bottom-0 left-0 w-[calc(100%-1rem)] h-0.5 bg-accent/80 rounded-full overflow-hidden mx-2">
                <div class="h-full bg-primary/70 duration-100 transition-all" style="width: {player.progress}%;"></div>
            </div>
            <div class="absolute left-0 w-3/4 h-full -z-10 blur-3xl opacity-60" class:hidden={settings.prefersReducedTransparency}>
                {#key coverURL}
                    <img class="size-full absolute top-0 left-0" src={coverURL} alt="" transition:fade={{ duration: 1000 }}>
                {/key}
            </div>
        </div>
    </div>
{/if}