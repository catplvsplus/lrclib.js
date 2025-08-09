<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { Button } from '@/components/ui/button';
    import { ArrowDownToLineIcon, BookmarkIcon, CheckLineIcon, DownloadIcon, HeartIcon, HeartMinusIcon } from '@lucide/svelte';
    import FlyInOut from '../FlyInOut.svelte';
    import { cn } from '../../../helpers/utils';

    let {
        track
    }: {
        track: APIResponse.Get.TrackSignature;
    } = $props();

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

<Button
    variant="secondary"
    onclick={toggleLike}
    class={cn(
        "relative overflow-clip text-sm font-bold text-muted-foreground bg-muted/90",
        isLiked && "text-primary bg-primary/10 hover:bg-primary/15",
    )}
>
    {#if isLiked}
        <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
            <HeartIcon class="size-5!" fill="currentColor"/>
            <span>Liked</span>
        </FlyInOut>
    {:else}
        <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
            <HeartIcon class="size-5!"/>
            <span>Like</span>
        </FlyInOut>
    {/if}
    <div class="flex items-center gap-1 opacity-0">
        <HeartIcon class="size-5!"/>
        <span>{isLiked ? 'Liked' : 'Like'}</span>
    </div>
</Button>
<Button
    variant="secondary"
    onclick={toggleSave}
    class={cn(
        "relative overflow-clip text-sm font-bold text-muted-foreground bg-muted/90",
        isSaved && "text-orange-500 bg-orange-500/10 hover:bg-orange-500/15 dark:text-orange-400 dark:bg-orange-400/10 dark:hover:bg-orange-400/15",
    )}
>
    {#if isSaved}
        <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
            <BookmarkIcon class="size-5!" fill="currentColor"/>
            <span>Saved</span>
        </FlyInOut>
    {:else}
        <FlyInOut class="flex items-center gap-1" inY={30} outY={-30}>
            <BookmarkIcon class="size-5!"/>
            <span>Save</span>
        </FlyInOut>
    {/if}
    <div class="flex items-center gap-1 opacity-0">
        <ArrowDownToLineIcon class="size-5!"/>
        <span>{isSaved ? 'Saved' : 'Save'}</span>
    </div>
</Button>