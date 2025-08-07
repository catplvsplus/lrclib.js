<script lang="ts">
    import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
    import SearchInput from '$lib/components/shared/home/SearchInput.svelte';
    import { stringifyQuery } from '$lib/helpers/utils.js';
    import { MetaTags } from 'svelte-meta-tags';

    let { data } = $props();

    let query = $derived(data.query);
    let tracks = $derived(data.tracks);
</script>

<svelte:head>
    <title>Lrclib.js | Search {query && stringifyQuery(query)}</title>
</svelte:head>

<MetaTags title="Lrclib.js | Search {query && stringifyQuery(query)}" description={query ? `Lrclib search results for ${stringifyQuery(query)}` : `Search Lrclib for lyrics`}/>

<div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    <SearchInput/>
    {#each tracks ?? [] as track}
        <Card>
            <CardHeader>
                <CardTitle>{track.trackName}</CardTitle>
                <CardDescription>{track.artistName} - {track.albumName}</CardDescription>
            </CardHeader>
        </Card>
    {/each}
</div>