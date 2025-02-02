<script lang="ts">
    import NavBar from "$lib/components/shared/NavBar.svelte";
    import { lrclib, type APIOptions, type Track } from 'lrclib';
    import { queryParameters, ssp } from 'sveltekit-search-params';
    import SearchBox from '$lib/components/shared/SearchBox.svelte';
    import ResultsSkeleton from '$lib/components/shared/ResultsSkeleton.svelte';
    import { onMount } from 'svelte';
    import AdvancedSearch from '../../lib/components/shared/AdvancedSearch.svelte';
    import { isAdvancedSearchOptions } from '../../lib/helpers/utils';

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

    async function fetchTracks(data?: APIOptions.Get.Search): Promise<void> {
        $params = data
            ? {
                q: 'q' in data ? data.q : null,
                track_name: 'track_name' in data ? data.track_name : null,
                artist_name: 'artist_name' in data ? data.artist_name ?? null : null,
                album_name: 'album_name' in data ? data.album_name ?? null : null
            }
            : $params;
        results = null;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(async () => {
            results = await lrclib.search(data ?? getQuery());
            timeout = null;
        }, 500);
    }

    onMount(async () => {
        await fetchTracks();
    });
</script>
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
            <div class="h-full w-full flex justify-center items-center">
                {#if results === null}
                    <ResultsSkeleton/>
                {:else if results.length === 0}
                    <h1 class="text-xl font-semibold ml-2">No results</h1>
                {/if}
            </div>
        {:else}
            <div class="flex items-center gap-2 flex-col flex-shrink-0">
                {#each results as result}
                    <div>
                        <a href="/track/{result.id}">{result.trackName}</a>
                        <a href="/artist/{result.artistName}">{result.artistName}</a>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>