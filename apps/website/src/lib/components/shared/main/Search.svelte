<script lang="ts">
    import { page } from "$app/state";
    import FlyInOut from '../FlyInOut.svelte';
    import { AlbumIcon, ChartNoAxesGanttIcon, ListMusicIcon, LoaderIcon, SearchIcon, TextCursorIcon, TextCursorInputIcon } from '@lucide/svelte';
    import { SearchEngine } from '$lib/helpers/classes/SearchEngine.svelte';
    import SearchInput from '../home/SearchInput.svelte';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { slide } from 'svelte/transition';
    import { Button } from '@/components/ui/button';
    import ImportMetadata from '../publish/ImportMetadata.svelte';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import { isQueryEmpty, isTrackSignatureSearch, stringifyQuery } from '$lib/helpers/utils';
    import type { APIOptions } from 'lrclib.js';
    import { OfflineSearchEngine } from '$lib/helpers/classes/OfflineSearchEngine.svelte';
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let {
        query = $bindable(),
        isAdvanced = $bindable(false),
        searchEngine,
        trackNameRequired = false,
        updateSearchParams = true
    }: {
        query: APIOptions.Get.Search;
        isAdvanced?: boolean;
        searchEngine: SearchEngine|OfflineSearchEngine;
        trackNameRequired?: boolean;
        updateSearchParams?: boolean;
    } = $props();

    let queryString = $derived(query ? stringifyQuery(query) : '');

    function search(options?: APIOptions.Get.Search|null) {
        options = convertQuery(isAdvanced, options ?? query);

        searchEngine.search(options);
    }

    function setSearchMode(advanced: boolean) {
        isAdvanced = advanced;

        search(convertQuery(advanced));
    }

    function convertQuery(isAdvanced: boolean, data?: APIOptions.Get.Search): APIOptions.Get.Search {
        data ??= query;

        if (isAdvanced) {
            if (isTrackSignatureSearch(data)) {
                return query = {
                    track_name: (data as APIOptions.Get.SearchTrackSignature).track_name ?? '',
                    artist_name: (data as APIOptions.Get.SearchTrackSignature).artist_name,
                    album_name: (data as APIOptions.Get.SearchTrackSignature).album_name
                };
            }

            return query = { track_name: stringifyQuery(data) };
        } else {
            return query = { q: 'q' in data ? data.q : stringifyQuery(data) }
        }
    }

    function setSearchParams(): void {
        if (!updateSearchParams) return;

        let params: string[] = [];

        for (const key of Object.keys(query)) {
            const value = query[key as keyof APIOptions.Get.Search];

            if (value !== undefined) params.push(`${key}=${encodeURIComponent(value)}`);
        }

        goto(`?${params.join('&')}`, { keepFocus: true });
    }

    onMount(() => {
        searchEngine.onSearch = () => setSearchParams();
    });

    onDestroy(() => {
        searchEngine.onSearch = null;
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
                            setMetadata={async metadata => search(query = {
                                track_name: metadata.trackName ?? '',
                                album_name: metadata.albumName,
                                artist_name: metadata.artistName
                            })}
                        />
                        <Card>
                            <CardHeader>
                                <CardTitle class="flex items-center gap-1">
                                    <TextCursorIcon class="text-primary size-5"/>
                                    Advanced Search
                                </CardTitle>
                                <CardDescription>
                                    Enter the track information you want to search
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="grid gap-3">
                                <div class="grid gap-0.5">
                                    <Label for="track_name" class="text-sm text-foreground/70 font-semibold">Track name</Label>
                                    <Input
                                        id="track_name"
                                        bind:value={
                                            () => 'track_name' in query ? query.track_name : '',
                                            v => search(query = {
                                                ...query,
                                                track_name: v
                                            })
                                        }
                                        placeholder="Some song (ft. some artist)"
                                    />
                                </div>
                                <div class="grid gap-0.5">
                                    <Label for="artist_name" class="text-sm text-foreground/70 font-semibold">Artist name</Label>
                                    <Input
                                        id="artist_name"
                                        disabled={trackNameRequired && (!('track_name' in query) || !query.track_name)}
                                        bind:value={
                                            () => 'artist_name' in query ? query.artist_name : '',
                                            v => search(query = {
                                                ...query,
                                                artist_name: v
                                            })
                                        }
                                        placeholder="Some artist"
                                    />
                                </div>
                                <div class="grid gap-0.5">
                                    <Label for="album_name" class="text-sm text-foreground/70 font-semibold">Album name</Label>
                                    <Input
                                        id="album_name"
                                        disabled={trackNameRequired && (!('track_name' in query) || !query.track_name)}
                                        bind:value={
                                            () => 'album_name' in query ? query.album_name : '',
                                            v => search(query = {
                                                ...query,
                                                album_name: v
                                            })
                                        }
                                        placeholder="Some album"
                                    />
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
                        bind:value={
                            () => queryString,
                            v => search(query = { q: v })
                        }
                        placeholder="Search..."
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
            {:else if query && !isQueryEmpty(query)}
                <FlyInOut class="flex items-center gap-1">
                    <ChartNoAxesGanttIcon class="size-4"/>
                    <span>No results found</span>
                </FlyInOut>
            {:else if searchEngine instanceof SearchEngine}
                <FlyInOut class="flex items-center gap-1">
                    <TextCursorInputIcon class="size-4"/>
                    <span>Type to search</span>
                </FlyInOut>
            {:else if searchEngine instanceof OfflineSearchEngine}
                <FlyInOut class="flex items-center gap-1">
                    <AlbumIcon class="size-4"/>
                    <span>Showing {savedLyrics.size} tracks</span>
                </FlyInOut>
            {/if}
        </p>
        <a
            href={page.url.toString()}
            class="shrink-0"
            onclick={event => {
                event.preventDefault();
                setSearchMode(!isAdvanced);
            }}
        >
            Use {isAdvanced ? 'basic' : 'advanced'} search
        </a>
    </div>
</div>