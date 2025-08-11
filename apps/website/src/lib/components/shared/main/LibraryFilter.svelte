<script lang="ts">
    import { Button, type ButtonProps } from "@/components/ui/button";
    import { BookmarkIcon, HeartIcon } from '@lucide/svelte';
    import { cn } from '$lib/helpers/utils';
    import { SavedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';

    let {
        filter = $bindable()
    }: {
        filter: (keyof SavedLyrics.FetchLibraryOptions)[];
    } = $props();

    function toggleFilter(key: keyof SavedLyrics.FetchLibraryOptions) {
        if (filter.includes(key)) {
            filter = filter.filter(f => f !== key);
        } else {
            filter.push(key);
        }
    }

    $inspect(filter);
</script>

{#snippet LikedButton(props: ButtonProps)}
    <Button
        variant="outline"
        size="sm"
        {...props}
        class={cn("rounded-full", props.class)}
        onclick={() => toggleFilter('liked')}
    >
        <HeartIcon fill={props.variant === 'default' ? 'currentColor' : ''}/>
        Liked
    </Button>
{/snippet}
{#snippet SavedButton(props: ButtonProps)}
    <Button
        variant="outline"
        size="sm"
        {...props}
        class={cn("rounded-full", props.class)}
        onclick={() => toggleFilter('saved')}
    >
        <BookmarkIcon fill={props.variant === 'default' ? 'currentColor' : ''}/>
        Saved
    </Button>
{/snippet}

<div class="flex gap-2">
    {#each filter as activeKey}
        {#if activeKey === 'liked'}
            {@render LikedButton({ variant: 'default' })}
        {:else if activeKey === 'saved'}
            {@render SavedButton({ variant: 'default' })}
        {/if}
    {/each}
    {#if !filter.includes('liked')}
        {@render LikedButton({ variant: 'outline' })}
    {/if}
    {#if !filter.includes('saved')}
        {@render SavedButton({ variant: 'outline' })}
    {/if}
</div>