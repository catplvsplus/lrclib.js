<script lang="ts">
    import NavBar from "$lib/components/shared/NavBar.svelte";
    import { lrclib, type APIOptions, type Track } from 'lrclib';
    import { queryParameters, ssp } from 'sveltekit-search-params';
    import ResultsSkeleton from '$lib/components/shared/ResultsSkeleton.svelte';
    import { onMount } from 'svelte';
    import AdvancedSearch from '$lib/components/shared/AdvancedSearch.svelte';
    import { getSearchName, isAdvancedSearchOptions } from '$lib/helpers/utils';
    import SearchResult from '$lib/components/shared/SearchResult.svelte';

    const params = queryParameters({
        q: true,
        track_name: true,
        artist_name: true,
        album_name: true
    });

    let results = $state<null|Track[]>(null);
    let timeout: NodeJS.Timeout|null = $state(null);

    function getQuery(): APIOptions.Get.Search {
        if ($params.track_name) {
            return {
                track_name: $params.track_name,
                artist_name: $params.artist_name ?? undefined,
                album_name: $params.album_name ?? undefined
            };
        }

        return { q: $params.q ?? '' };
    }

    async function fetchTracks(data?: APIOptions.Get.Search, debounce: boolean = true): Promise<void> {
        results = null;
        $params = data
            ? {
                q: 'q' in data ? data.q : null,
                track_name: 'track_name' in data ? data.track_name : null,
                artist_name: 'artist_name' in data ? data.artist_name ?? null : null,
                album_name: 'album_name' in data ? data.album_name ?? null : null
            }
            : $params;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(async () => {
            results = await lrclib.search(data ?? getQuery());
            timeout = null;
        }, debounce ? 500 : 0);
    }

    onMount(async () => await fetchTracks(getQuery(), false));
</script>

<svelte:head>
    <title>Lrclib.js | Search {getSearchName(getQuery())}</title>
</svelte:head>

<NavBar addSearchBox={false}/>

<div class="pt-16 flex justify-center h-full">
    <div class="w-full max-w-screen-2xl p-5 flex flex-col gap-5">
        <div class="flex flex-col gap-2 max-w-screen-2xl">
            <AdvancedSearch
                isAdvancedSearch={isAdvancedSearchOptions(getQuery())}
                search={getQuery()}
                onChange={data => fetchTracks(data)}
                bind:results
            />
        </div>
        {#if !results?.length}
                {#if results === null}
                    <ResultsSkeleton/>
                {:else if results.length === 0}
                    <div class="h-full w-full flex justify-center items-center">
                        <div class="text-center">
                            <h1 class="text-xl font-semibold ml-2">No results</h1>
                            <p class="text-muted-foreground ml-2">Try searching for something else</p>
                        </div>
                    </div>
                {/if}
        {:else}
            <div class="columns-xs pb-5">
                {#each results as result}
                    <SearchResult {result}/>
                {/each}
            </div>
        {/if}
    </div>
</div>