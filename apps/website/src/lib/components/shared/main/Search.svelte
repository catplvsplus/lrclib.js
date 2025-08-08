<script lang="ts">
    import { page } from "$app/state";
    import FlyInOut from '../FlyInOut.svelte';
    import { ChartNoAxesGanttIcon, ListMusicIcon, LoaderIcon, SearchIcon, TextCursorInputIcon, TextIcon } from '@lucide/svelte';
    import { searchEngine } from '$lib/helpers/classes/SearchEngine.svelte';
    import type { APIOptions } from 'lrclib.js';
    import SearchInput from '../home/SearchInput.svelte';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { Button } from '@/components/ui/button';
    import ImportMetadata from '../publish/ImportMetadata.svelte';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { settings } from '$lib/helpers/classes/Settings.svelte';

    let {
        queries,
        helper,
        query,
        isAdvanced = $bindable(false)
    }: {
        queries: ReturnType<typeof searchEngine['useQueryParams']>[0];
        helper: ReturnType<typeof searchEngine['useQueryParams']>[1];
        query: APIOptions.Get.Search|null;
        isAdvanced?: boolean;
    } = $props();

    function search() {
        searchEngine.search(query ?? { q: '' });
    }

    function fixURLQueries() {
        searchEngine.fixURLQueries({
            query: query ?? { q: '' },
            helper,
            isAdvanced
        });
    }

    onMount(() => {
        if (query) fixURLQueries();
    })
</script>

<div class="grid gap-2 h-fit">
    <div>
        {#key isAdvanced}
            <div transition:slide={{ duration: settings.prefersReducedMotion ? 0 : 300 }}>
                {#if isAdvanced}
                    <form
                        class="grid gap-3"
                        onsubmit={event => {
                            event.preventDefault();
                            search();
                        }}
                    >
                        <ImportMetadata
                            disabled={searchEngine.status === 'searching'}
                            setMetadata={metadata => {
                                queries.track_name = metadata.trackName ?? '';
                                queries.artist_name = metadata.artistName ?? '';
                                queries.album_name = metadata.albumName ?? '';
                                search();
                            }}
                        />
                        <Card>
                            <CardHeader>
                                <CardTitle class="flex items-center gap-1">
                                    <TextIcon class="text-primary size-5"/>
                                    Advanced Search
                                </CardTitle>
                                <CardDescription>
                                    Enter the track information you want to search
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="grid gap-3">
                                <div class="grid gap-0.5">
                                    <Label for="track_name" class="text-sm text-foreground/70 font-semibold">Track name</Label>
                                    <Input id="track_name" bind:value={queries.track_name} placeholder="Some song (ft. some artist)" oninput={() => search()}/>
                                </div>
                                <div class="grid gap-0.5">
                                    <Label for="artist_name" class="text-sm text-foreground/70 font-semibold">Artist name</Label>
                                    <Input id="artist_name" bind:value={queries.artist_name} placeholder="Some artist" oninput={() => search()}/>
                                </div>
                                <div class="grid gap-0.5">
                                    <Label for="album_name" class="text-sm text-foreground/70 font-semibold">Album name</Label>
                                    <Input id="album_name" bind:value={queries.album_name} placeholder="Some album" oninput={() => search()}/>
                                </div>
                            </CardContent>
                            <CardFooter class="flex sm:justify-end">
                                <Button class="w-full sm:w-auto" type="submit" disabled={searchEngine.status === 'searching' || !query}>
                                    <SearchIcon/>
                                    <span class="hidden sm:inline">Search</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                {:else}
                    <SearchInput
                        bind:value={queries.q}
                        placeholder="Search..."
                        oninput={() => search()}
                        onSubmit={event => {
                            event.preventDefault();
                            search();
                        }}
                    />
                {/if}
            </div>
        {/key}
    </div>
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
        <a
            href={page.url.toString()}
            class="shrink-0"
            onclick={event => {
                event.preventDefault();
                isAdvanced = !isAdvanced;
                fixURLQueries();
            }}
        >
            Use {isAdvanced ? 'basic' : 'advanced'} search
        </a>
    </div>
</div>