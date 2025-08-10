<script lang="ts">
    import { cn, isQueryEmpty, parseQuery, stringifyQuery, isTrackSignatureSearch } from '$lib/helpers/utils.js';
    import { MetaTags } from 'svelte-meta-tags';
    import { searchEngine } from '$lib/helpers/classes/SearchEngine.svelte';
    import { onDestroy, onMount, tick, untrack } from 'svelte';
    import { page } from '$app/state';
    import Search from '$lib/components/shared/main/Search.svelte';
    import { PersistedState } from 'runed';
    import { HeartCrackIcon, SearchIcon } from '@lucide/svelte';
    import { Skeleton } from '$lib/components/ui/skeleton/index.js';
    import TrackCard from '@/components/shared/track/TrackCard.svelte';
    import { queryParameters, queryParam } from 'sveltekit-search-params';

    const queryParams = queryParameters({
        q: true,
        track_name: true,
        artist_name: true,
        album_name: true
    });

    let query = $derived(parseQuery($queryParams));
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
    title={queryString}
    titleTemplate="Lrclib.js | Search %s"
    description={queryString
        ? `Lrclib search results for ${queryString}`
        : `Search Lrclib for lyrics`
    }
/>

<div
    class={cn(
        "sm:pt-0 pt-16 w-full mx-auto grid gap-5 transition-all duration-300",
        isAdvancedSearch.current ? "xl:grid-cols-3" : "xl:grid-cols-2"
    )}
>
    <div
        class={cn(
            "grid gap-4 grid-cols-1",
            isAdvancedSearch.current
                ? "xl:col-span-1"
                : "xl:col-span-3 xl:grid-cols-3"
        )}
    >
        <Search {queryParams} bind:isAdvanced={isAdvancedSearch.current}/>
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
                {#each { length: 20 } as _}
                    <Skeleton class="h-25 rounded-lg"/>
                {/each}
            {:else}
                {#each searchEngine.tracks ?? [] as track}
                    <TrackCard {track}/>
                {/each}
            {/if}
        </div>
    {:else}
        <div
            class={cn(
                "flex justify-center items-center",
                isAdvancedSearch.current
                    ? "xl:col-span-2"
                    : "xl:col-span-3 min-h-[500px]"
            )}
        >
            <div class="grid gap-2 text-muted-foreground">
                {#if !isEmptyQuery && !searchEngine.tracks.length}
                    <HeartCrackIcon class="size-20 mx-auto"/>
                    <div class="text-center">
                        <h4 class="font-bold text-lg">No results found</h4>
                        <p class="text-sm opacity-70">Try searching for another keyword</p>
                    </div>
                {:else}
                    <SearchIcon class="size-20 mx-auto"/>
                    <div class="text-center">
                        <h4 class="font-bold text-lg">Search for lyrics</h4>
                        <p class="text-sm opacity-70">Start typing to search lyrics</p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>