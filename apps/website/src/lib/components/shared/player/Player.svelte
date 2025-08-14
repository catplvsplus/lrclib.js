<script lang="ts">
    import { onMount } from 'svelte';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { fly } from 'svelte/transition';
    import { resolve } from '$app/paths';
    import { Button } from '../../ui/button';
    import { PlayIcon, PauseIcon } from '@lucide/svelte';
    import FlyInOut from '../FlyInOut.svelte';

    onMount(() => {
        player.initialize();
    });
</script>

{#if player.playing}
    {@const title = player.playing.title}
    {@const description = [player.playing.artist, player.playing.album].filter(Boolean).join(' • ')}
    {@const coverURL = player.playing.coverImageURL ?? `${resolve('/')}cover.png`}
    <div class="fixed bottom-0 right-0 w-full max-w-sm z-30" in:fly={{ y: 100 }} out:fly={{ y: -100 }}>
        <div class="m-4 bg-card border rounded-lg p-2 shadow flex items-center gap-2">
            <div class="size-12 overflow-hidden rounded-sm shrink-0">
                <img class="size-full object-cover" src={coverURL} alt="">
            </div>
            <div class="flex flex-col justify-center w-full whitespace-nowrap overflow-hidden">
                <h3 title={title} class="text-base font-semibold text-ellipsis overflow-clip">{title}</h3>
                <p title={description} class="text-xs leading-tight text-muted-foreground text-ellipsis overflow-clip">{description}</p>
            </div>
            <div class="shrink-0 size-10">
                <Button
                    size="icon"
                    class="size-10 rounded-full overflow-hidden relative"
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
        </div>
    </div>
{/if}