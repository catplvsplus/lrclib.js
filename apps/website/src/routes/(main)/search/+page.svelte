<script lang="ts">
    import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
    import { parseQuery, stringifyQuery } from '$lib/helpers/utils.js';
    import { MetaTags } from 'svelte-meta-tags';
    import { searchEngine } from '$lib/helpers/classes/SearchEngine.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import Search from '$lib/components/shared/main/Search.svelte';
    import { PersistedState } from 'runed';

    let { data } = $props();

    const [queries, queryHelper] = searchEngine.useQueryParams(page.url);

    let query = $derived(parseQuery(queries));
    let queryString = $derived(query ? stringifyQuery(query) : '');
    let isAdvancedSearch = new PersistedState('lrclib-advanced-search', false);

    onMount(() => {
        if (data.query) searchEngine.search(data.query);
    });
</script>

<svelte:head>
    <title>Lrclib.js | Search {queryString}</title>
</svelte:head>

<MetaTags
    title="Lrclib.js | Search {queryString}"
    description={queryString
        ? `Lrclib search results for ${queryString}`
        : `Search Lrclib for lyrics`
    }
/>

<div class="sm:pt-0 pt-16 w-full mx-auto grid gap-5">
    <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Search {queries} {query} helper={queryHelper} bind:isAdvanced={isAdvancedSearch.current}/>
    </div>
    <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {#each searchEngine.tracks ?? [] as track}
            <Card>
                <CardHeader>
                    <CardTitle>{track.trackName}</CardTitle>
                    <CardDescription>{track.artistName} - {track.albumName}</CardDescription>
                </CardHeader>
            </Card>
        {/each}
    </div>
</div>