<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { Button, type ButtonProps } from '@/components/ui/button';
    import { ArrowDownToLineIcon, BookmarkIcon, HeartIcon } from '@lucide/svelte';
    import FlyInOut from '../FlyInOut.svelte';
    import { cn } from '$lib/helpers/utils';
    import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
    import type { ClassValue } from 'svelte/elements';

    let {
        track,
        labelClass,
        ...buttonProps
    }: {
        track: APIResponse.Get.TrackSignature;
        labelClass?: ClassValue;
    } & ButtonProps = $props();

    let isSaved = $derived(savedLyrics.isSaved(track));
    let isLiked = $derived(savedLyrics.isLiked(track));

    function toggleLike() {
        if (isLiked) {
            savedLyrics.unlike(track);
        } else {
            savedLyrics.like(track);
        }
    }

    function toggleSave() {
        if (isSaved) {
            savedLyrics.remove(track);
        } else {
            savedLyrics.save(track);
        }
    }
</script>

<Tooltip disableCloseOnTriggerClick>
    <TooltipTrigger>
        {#snippet child({ props })}
            <Button
                {...props}
                {...buttonProps}
                variant="secondary"
                onclick={toggleLike}
                class={cn(
                    "relative overflow-clip",
                    buttonProps.class,
                    isLiked && "text-primary bg-primary/10 hover:bg-primary/15",
                )}
            >
                {#if isLiked}
                    <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
                        <HeartIcon class="size-5!" fill="currentColor"/>
                        <span class={labelClass}>Liked</span>
                    </FlyInOut>
                {:else}
                    <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
                        <HeartIcon class="size-5!"/>
                        <span class={labelClass}>Like</span>
                    </FlyInOut>
                {/if}
                <div class="flex items-center gap-1 opacity-0">
                    <HeartIcon class="size-5!"/>
                    <span class={labelClass}>{isLiked ? 'Liked' : 'Like'}</span>
                </div>
            </Button>
        {/snippet}
    </TooltipTrigger>
    <TooltipContent class={labelClass}>{isLiked ? 'Remove from like' : 'Add to likes'}</TooltipContent>
</Tooltip>
<Tooltip disableCloseOnTriggerClick>
    <TooltipTrigger>
        {#snippet child({ props })}
            <Button
                {...props}
                {...buttonProps}
                variant="secondary"
                onclick={toggleSave}
                class={cn(
                    "relative overflow-clip",
                    buttonProps.class,
                    isSaved && "text-orange-500 bg-orange-500/10 hover:bg-orange-500/15 dark:text-orange-400 dark:bg-orange-400/10 dark:hover:bg-orange-400/15",
                )}
            >
                {#if isSaved}
                    <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
                        <BookmarkIcon class="size-5!" fill="currentColor"/>
                        <span class={labelClass}>Saved</span>
                    </FlyInOut>
                {:else}
                    <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
                        <BookmarkIcon class="size-5!"/>
                        <span class={labelClass}>Save</span>
                    </FlyInOut>
                {/if}
                <div class="flex items-center gap-1 opacity-0">
                    <ArrowDownToLineIcon class="size-5!"/>
                    <span class={labelClass}>{isSaved ? 'Saved' : 'Save'}</span>
                </div>
            </Button>
        {/snippet}
    </TooltipTrigger>
    <TooltipContent>{isSaved ? 'Remove from saves' : 'Save track offline'}</TooltipContent>
</Tooltip>