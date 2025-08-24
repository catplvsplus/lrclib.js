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
    import { Button } from '../../ui/button/index';
    import { CirclePlusIcon, ListMusicIcon, MicVocalIcon } from '@lucide/svelte';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
    import { userInterface } from '../../../helpers/classes/UserInterface.svelte';

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<Card
    class={cn(
        "h-fit z-10 relative overflow-hidden"
    )}
>
    <CardContent class="flex gap-5 items-center relative z-10 flex-col lg:flex-row">
        <div class="w-full lg:w-60 max-w-96 shrink-0">
            <AspectRatio class="overflow-hidden rounded-lg relative shadow">
                {#key coverURL}
                    <img src={coverURL} alt="" class="size-full object-cover object-center absolute" transition:blur={{ duration: settings.prefersReducedMotion ? 0 : 300 }}>
                {/key}
            </AspectRatio>
        </div>
        {#if player.playing}
            <div class="grid gap-6 h-fit w-full max-w-96 sm:max-w-none" class:dark={!settings.prefersReducedTransparency}>
                <div class="grid text-center lg:text-start">
                    <h3 class="text-2xl xl:text-4xl text-foreground font-bold leading-tight truncate whitespace-normal line-clamp-2">{player.playing?.title}</h3>
                    <p class="text-base xl:text-lg text-foreground/70 truncate whitespace-normal line-clamp-2">{[player.playing?.artist, player.playing?.album].filter(Boolean).join(' • ')}</p>
                </div>
                <div class="grid gap-2">
                    <PlayerProgressBar/>
                    <div class="flex gap-4 items-center lg:flex-row flex-col">
                        <PlayerControls class="w-full lg:w-auto justify-center"/>
                        <div class="flex items-center gap-2 w-full justify-between lg:justify-end">
                            <Tooltip>
                                <TooltipTrigger>
                                    {#snippet child({ props })}
                                        <Button
                                            {...props}
                                            size="icon"
                                            variant="secondary"
                                            class={cn(
                                                "size-10 rounded-full overflow-hidden relative bg-foreground/5 hover:bg-foreground/20 text-foreground/70",
                                                userInterface.playerMenu === 'lyrics' ? "bg-foreground/20 text-foreground" : ""
                                            )}
                                            onclick={() => userInterface.playerMenu = 'lyrics'}
                                        >
                                            <MicVocalIcon class="size-5"/>
                                        </Button>
                                    {/snippet}
                                </TooltipTrigger>
                                <TooltipContent>Show lyrics</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    {#snippet child({ props })}
                                        <Button
                                            {...props}
                                            size="icon"
                                            variant="secondary"
                                            class={cn(
                                                "size-10 rounded-full overflow-hidden relative bg-foreground/5 hover:bg-foreground/20 text-foreground/70",
                                                userInterface.playerMenu === 'queue' ? "bg-foreground/20 text-foreground" : ""
                                            )}
                                            onclick={() => userInterface.playerMenu = 'queue'}
                                        >
                                            <ListMusicIcon class="size-5"/>
                                        </Button>
                                    {/snippet}
                                </TooltipTrigger>
                                <TooltipContent>Show queue</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div class="grid gap-6 h-fit w-full max-w-96 sm:max-w-none">
                <div class="grid text-center">
                    <h3 class="text-2xl xl:text-4xl text-foreground font-bold leading-tight">No track playing</h3>
                    <p class="text-base xl:text-lg text-foreground/70">Add some tracks to the queue and start playing!</p>
                    <div class="mt-2">
                        <Button variant="secondary" class="bg-foreground/10! cursor-pointer text-foreground font-semibold" onclick={() => player.filesInput?.click()}>
                            <CirclePlusIcon/>
                            Add Track
                        </Button>
                    </div>
                </div>
            </div>
        {/if}
    </CardContent>
    <div
        class="size-full absolute top-0 left-0 -z-10 overflow-hidden"
        class:hidden={settings.prefersReducedTransparency || !player.playing}
    >
        <div class="absolute size-full backdrop-blur-3xl backdrop-saturate-150 z-10 bg-black/50"></div>
        {#key coverURL}
            <div
                class="size-full scale-125 object-cover object-center absolute"
                style="background-image: url({coverURL})"
                transition:fade={{ duration: settings.prefersReducedMotion ? 0 : 300 }}
            >
            </div>
        {/key}
    </div>
</Card>