<script lang="ts">
    import { cn, isQueryEmpty, parseQuery, stringifyQuery, isTrackSignatureSearch } from '$lib/helpers/utils.js';
    import { MetaTags } from 'svelte-meta-tags';
    import { onMount, untrack } from 'svelte';
    import Search from '$lib/components/shared/main/Search.svelte';
    import { PersistedState } from 'runed';
    import { HeartCrackIcon, LibraryBigIcon } from '@lucide/svelte';
    import TrackCard from '@/components/shared/track/TrackCard.svelte';
    import { queryParameters } from 'sveltekit-search-params';
    import { offlineSearchEngine } from '$lib/helpers/classes/OfflineSearchEngine.svelte';
    import TracksSkeleton from '$lib/components/shared/track/TracksSkeleton.svelte';
    import { savedLyrics, type SavedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import TrackErrorCard from '$lib/components/shared/track/TrackErrorCard.svelte';
    import LibraryFilter from '$lib/components/shared/main/LibraryFilter.svelte';

    const queryParams = queryParameters({
        q: true,
        track_name: true,
        artist_name: true,
        album_name: true
    });

    let query = $derived(parseQuery($queryParams));
    let queryString = $derived(query ? stringifyQuery(query) : '');
    let isEmptyQuery = $derived(isQueryEmpty(query ?? {}));
    let filter: (keyof SavedLyrics.FetchLibraryOptions)[] = $state([]);
    let isAdvancedSearch = new PersistedState('lrclib-advanced-search', false);

    onMount(async () => {
        if (query) offlineSearchEngine.search(query);

        const isTrackSignatureQuery = untrack(() => isTrackSignatureSearch(query ?? {}));
        if (isTrackSignatureQuery !== null) isAdvancedSearch.current = isTrackSignatureQuery;
    });

    $effect(() => {
        if (isEmptyQuery) {
            const options: SavedLyrics.FetchLibraryOptions = filter.length
                ? filter.reduce(
                    (acc, key) => ({ ...acc, [key]: true }),
                    { liked: false, saved: false }
                )
                : {};

            savedLyrics.fetchLibrary(options);
        }
    });
</script>

<MetaTags
    title={queryString || 'all'}
    titleTemplate="Lrclib.js | Library %s"
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
        <Search {queryParams} searchEngine={offlineSearchEngine} bind:isAdvanced={isAdvancedSearch.current}/>
        <LibraryFilter bind:filter/>
    </div>
    {#if offlineSearchEngine.tracks.length || savedLyrics.size || offlineSearchEngine.status === 'searching'}
        <div
            class={cn(
                "grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 h-fit",
                isAdvancedSearch.current
                    ? "xl:col-span-2"
                    : "xl:grid-cols-3 xl:col-span-3"
            )}
        >
            {#if offlineSearchEngine.status === 'searching'}
                <TracksSkeleton count={20}/>
            {:else if offlineSearchEngine.tracks.length}
                {#each offlineSearchEngine.tracks ?? [] as track}
                    <TrackCard {track}/>
                {/each}
            {:else if isEmptyQuery}
                {#if savedLyrics.status === 'loading'}
                    <TracksSkeleton count={20}/>
                {:else}
                    {#each savedLyrics.library as track}
                        {#if typeof track !== 'number'}
                            <TrackCard {track}/>
                        {:else}
                            <TrackErrorCard id={track}/>
                        {/if}
                    {/each}
                {/if}
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
                {#if !isEmptyQuery && !offlineSearchEngine.tracks.length}
                    <HeartCrackIcon class="size-20 mx-auto"/>
                    <div class="text-center">
                        <h4 class="font-bold text-lg">No results found</h4>
                        <p class="text-sm opacity-70">Try searching for another keyword</p>
                    </div>
                {:else}
                    <LibraryBigIcon class="size-20 mx-auto"/>
                    <div class="text-center">
                        <h4 class="font-bold text-lg">Your library is empty</h4>
                        <p class="text-sm opacity-70">Your saved & liked tracks will appear here</p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>