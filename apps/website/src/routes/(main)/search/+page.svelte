<script lang="ts">
    import { cn, isQueryEmpty, stringifyQuery, isTrackSignatureSearch } from '$lib/helpers/utils.js';
    import { MetaTags } from 'svelte-meta-tags';
    import { searchEngine } from '$lib/helpers/classes/SearchEngine.svelte';
    import { onMount, untrack } from 'svelte';
    import Search from '$lib/components/shared/main/Search.svelte';
    import { PersistedState } from 'runed';
    import { HeartCrackIcon, SearchIcon } from '@lucide/svelte';
    import TrackCard from '@/components/shared/track/TrackCard.svelte';
    import TracksSkeleton from '$lib/components/shared/track/TracksSkeleton.svelte';
    import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty/index.js';

    let { data } = $props();

    let query = $derived(data.query);
    let queryString = $derived(query ? stringifyQuery(query) : '');
    let isEmptyQuery = $derived(isQueryEmpty(query ?? {}));
    let isAdvancedSearch = new PersistedState('lrclib-advanced-search', false);

    onMount(async () => {
        if (query) searchEngine.search(query);

        const isTrackSignatureQuery = untrack(() => isTrackSignatureSearch(query ?? {}));
        if (isTrackSignatureQuery !== null) isAdvancedSearch.current = isTrackSignatureQuery;
    });
</script>

<MetaTags
    title={queryString || 'lyrics'}
    titleTemplate="Lrclib.js | Search %s"
    description={queryString
        ? `Lrclib search results for ${queryString}`
        : `Search Lrclib for lyrics`
    }
/>

<div
    class={cn(
        "w-full mx-auto grid gap-5 transition-all duration-300",
        isAdvancedSearch.current ? "xl:grid-cols-3" : "xl:grid-cols-2"
    )}
>
    <div
        class={cn(
            "grid gap-4 grid-cols-1 top-0",
            isAdvancedSearch.current
                ? "xl:col-span-1"
                : "xl:col-span-3 xl:grid-cols-3"
        )}
    >
        <Search
            bind:query={() => query ?? { q: '' }, v => query = v}
            searchEngine={searchEngine}
            bind:isAdvanced={isAdvancedSearch.current}
        />
    </div>
    {#if searchEngine.tracks.length || searchEngine.status === 'searching'}
        <div
            class={cn(
                "grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 h-fit",
                isAdvancedSearch.current
                    ? "xl:col-span-2"
                    : "xl:grid-cols-3 xl:col-span-3"
            )}
        >
            {#if searchEngine.status === 'searching'}
                <TracksSkeleton count={20}/>
            {:else}
                {#each searchEngine.tracks ?? [] as track}
                    <TrackCard {track}/>
                {/each}
            {/if}
        </div>
    {:else}
        <Empty
            class={cn(
                "h-full gap-0",
                isAdvancedSearch.current
                    ? "xl:col-span-2"
                    : "xl:col-span-3 min-h-[500px]"
            )}
        >
            {#if !isEmptyQuery && !searchEngine.tracks.length && searchEngine.status === 'idle'}
                <EmptyMedia>
                    <HeartCrackIcon class="size-20 mx-auto"/>
                </EmptyMedia>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyDescription>Try searching for another keyword</EmptyDescription>
            {:else}
                <EmptyMedia>
                    <SearchIcon class="size-20 mx-auto"/>
                </EmptyMedia>
                <EmptyTitle class="font-bold">Search for lyrics</EmptyTitle>
                <EmptyDescription>Start typing to search lyrics</EmptyDescription>
            {/if}
        </Empty>
    {/if}
</div>