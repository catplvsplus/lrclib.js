<script lang="ts">
    import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
    import { parseQuery, stringifyQuery } from '$lib/helpers/utils.js';
    import { MetaTags } from 'svelte-meta-tags';
    import { searchEngine } from '$lib/helpers/classes/SearchEngine.svelte';
    import type { APIOptions } from 'lrclib.js';
    import SearchInput from '$lib/components/shared/home/SearchInput.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import FlyInOut from '$lib/components/shared/FlyInOut.svelte';
    import { BookOpenTextIcon, ChartNoAxesGanttIcon, ListMusicIcon, LoaderIcon, PackageOpenIcon, TextCursorInputIcon, TextSearchIcon, TypeIcon } from '@lucide/svelte';

    let { data } = $props();

    const [queries, queryHelper] = searchEngine.useQueryParams(page.url);

    let query = $derived(parseQuery(queries));
    let queryString = $derived(query ? stringifyQuery(query) : '');

    onMount(() => {
        if (data.query) searchEngine.search(data.query);
    });

    function search() {
        if (query) searchEngine.search(query);
    }
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
        <div class="grid gap-2">
            <SearchInput
                bind:value={queries.q}
                placeholder="Search..."
                oninput={() => search()}
                onSubmit={event => {
                    event.preventDefault();
                    search();
                }}
            />
            <div class="flex justify-between text-xs text-muted-foreground">
                <p class="relative overflow-clip h-full w-full">
                    {#if searchEngine.status === 'searching'}
                        <FlyInOut class="flex items-center gap-1">
                            <LoaderIcon class="animate-spin size-4"/>
                            <span>Searching...</span>
                        </FlyInOut>
                    {:else if searchEngine.tracks.length}
                        <FlyInOut class="flex items-center gap-1">
                            <ListMusicIcon class="size-4"/>
                            <span>Showing {searchEngine.tracks.length} results</span>
                        </FlyInOut>
                    {:else if query !== null}
                        <FlyInOut class="flex items-center gap-1">
                            <ChartNoAxesGanttIcon class="size-4"/>
                            <span>No results found</span>
                        </FlyInOut>
                    {:else}
                        <FlyInOut class="flex items-center gap-1">
                            <TextCursorInputIcon class="size-4"/>
                            <span>Type to search</span>
                        </FlyInOut>
                    {/if}
                </p>
                <a href={page.url.toString()} class="shrink-0">
                    Use advanced search
                </a>
            </div>
        </div>
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