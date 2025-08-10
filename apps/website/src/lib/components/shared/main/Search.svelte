<script lang="ts">
    import { page } from "$app/state";
    import FlyInOut from '../FlyInOut.svelte';
    import { ChartNoAxesGanttIcon, ListMusicIcon, LoaderIcon, SearchIcon, TextCursorInputIcon, TextIcon } from '@lucide/svelte';
    import { searchEngine } from '$lib/helpers/classes/SearchEngine.svelte';
    import SearchInput from '../home/SearchInput.svelte';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { slide } from 'svelte/transition';
    import { Button } from '@/components/ui/button';
    import ImportMetadata from '../publish/ImportMetadata.svelte';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import type { queryParameters } from 'sveltekit-search-params';
    import { isTrackSignatureSearch, parseQuery, stringifyQuery } from '$lib/helpers/utils';
    import type { APIOptions } from 'lrclib.js';
    import { onMount } from 'svelte';

    let {
        queryParams,
        isAdvanced = $bindable(false)
    }: {
        queryParams: ReturnType<typeof queryParameters<{ q: true; track_name: true; artist_name: true; album_name: true; }>>;
        isAdvanced?: boolean;
    } = $props();

    let query = $derived(parseQuery($queryParams));
    let queryString = $derived(query ? stringifyQuery(query) : '');

    function search(options?: typeof query) {
        searchEngine.search(options ?? query);
    }

    function fixURLQueryParams(query: APIOptions.Get.Search|null) {
        const isTrackSignatureQuery = query && isTrackSignatureSearch(query);

        queryParams.set({
            q: !isAdvanced && isTrackSignatureQuery
                ? queryString
                : null,
            track_name: isAdvanced && !isTrackSignatureQuery
                ? queryString
                : null,
            album_name: null,
            artist_name: null
        });
    }
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
                            setMetadata={async metadata => {
                                search(parseQuery($queryParams = {
                                    q: null,
                                    track_name: metadata.trackName ?? null,
                                    artist_name: metadata.artistName ?? null,
                                    album_name: metadata.albumName ?? null
                                }));
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
                                    <Input
                                        id="track_name"
                                        bind:value={
                                            () => $queryParams.track_name,
                                            v => {
                                                search(parseQuery({
                                                    ...$queryParams,
                                                    track_name: v || null
                                                }))
                                            }
                                        }
                                        placeholder="Some song (ft. some artist)"
                                    />
                                </div>
                                <div class="grid gap-0.5">
                                    <Label for="artist_name" class="text-sm text-foreground/70 font-semibold">Artist name</Label>
                                    <Input
                                        id="artist_name"
                                        bind:value={
                                            () => $queryParams.artist_name,
                                            v => {
                                                search(parseQuery({
                                                    ...$queryParams,
                                                    artist_name: v || null
                                                }))
                                            }
                                        }
                                        placeholder="Some artist"
                                    />
                                </div>
                                <div class="grid gap-0.5">
                                    <Label for="album_name" class="text-sm text-foreground/70 font-semibold">Album name</Label>
                                    <Input
                                        id="album_name"
                                        bind:value={
                                            () => $queryParams.album_name,
                                            v => {
                                                search(parseQuery({
                                                    ...$queryParams,
                                                    album_name: v || null
                                                }))
                                            }
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
                            v => {
                                search(parseQuery($queryParams = {
                                    q: v,
                                    track_name: null,
                                    artist_name: null,
                                    album_name: null
                                }))
                            }
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
                fixURLQueryParams(query);
                search();
            }}
        >
            Use {isAdvanced ? 'basic' : 'advanced'} search
        </a>
    </div>
</div>