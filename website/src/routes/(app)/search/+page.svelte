<script lang="ts">
    import { InputGroup, InputGroupButton, InputGroupInput } from '$lib/components/ui/input-group';
    import { SearchIcon, LoaderCircleIcon, TextCursorIcon, TextSearchIcon, CircleXIcon, ListIcon, TextCursorInputIcon } from '@lucide/svelte';
    import lrclib, { type APIOptions, type Track } from 'lrclib.js';
    import { PersistedState, resource } from 'runed';
    import { isSearchEmpty, encodeURISearchQuery } from '$lib/helpers/utils.js';
    import { goto } from '$app/navigation';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
    import ImportMetadata from '$lib/components/app/ImportMetadata.svelte';
    import { Label } from '$lib/components/ui/label';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    import { cn } from 'cn';
    import { Skeleton } from '../../../lib/components/ui/skeleton/index.js';

    let { data } = $props();

    let query: APIOptions.Get.Search|null = $derived(data.query);

    let results = resource(
        () => query,
        async (query) => {
            goto(encodeURISearchQuery(query), { keepFocus: true })
            return !isSearchEmpty(query) ? lrclib.search(query!) : [] as Track[];
        },
        {
            debounce: 300
        }
    );

    const isAdvancedSearch = new PersistedState('advanced-search', false);
</script>

<div class="grid gap-4 @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 @2xl:px-0 px-4">
    <section
        class={cn(
            "grid gap-2 col-span-full",
            isAdvancedSearch.current && "@3xl:col-span-1 h-fit"
        )}
    >
        <form
            class="sticky grid @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 gap-2"
            onsubmit={event => {
                event.preventDefault();
                results.refetch();
            }}
        >
            {#if !isAdvancedSearch.current}
                <InputGroup
                    class={[
                        "rounded-xl ring-primary/20! focus-within:border-primary! hover:border-primary! hover:shadow-lg focus-within:shadow-lg shadow-primary/20 duration-300 transition-all",
                        "@3xl:col-span-1 col-span-full"
                    ]}
                >
                    <InputGroupInput
                        type="text"
                        placeholder="Search for a song, artist, or album"
                        class="placeholder:text-sm px-3"
                        bind:value={
                            () => query && 'q' in query ? query.q : '',
                            v => query = { q: v }
                        }
                    />
                    <InputGroupButton
                        type="submit"
                        size="icon-sm"
                        class="text-primary! bg-transparent!"
                        disabled={isSearchEmpty(query) || results.loading}
                    >
                        <SearchIcon/>
                    </InputGroupButton>
                </InputGroup>
            {:else}
                <div class="grid gap-3 col-span-full">
                    <ImportMetadata
                        disabled={results.loading}
                        setMetadata={async metadata => {
                            const data = {
                                track_name: metadata.trackName!,
                                artist_name: metadata.artistName,
                                album_name: metadata.albumName,
                            };

                            if (!isSearchEmpty(data)) {
                                query = data;
                                results.refetch();
                            }
                        }}
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
                                    placeholder="Some song (ft. some artist)"
                                    bind:value={
                                        () => query && 'track_name' in query ? query.track_name : '',
                                        v => query = { ...query, track_name: v }
                                    }
                                />
                            </div>
                            <div class="grid gap-0.5">
                                <Label for="artist_name" class="text-sm text-foreground/70 font-semibold">Artist name</Label>
                                <Input
                                    id="artist_name"
                                    placeholder="Some artist"
                                    disabled={isSearchEmpty(query) || 'track_name' in query && !query.track_name}
                                    bind:value={
                                        () => query && 'artist_name' in query ? query.artist_name : '',
                                        v => query = {
                                            ...query,
                                            track_name: query && 'track_name' in query ? query.track_name : '',
                                            artist_name: v
                                        }
                                    }
                                />
                            </div>
                            <div class="grid gap-0.5">
                                <Label for="album_name" class="text-sm text-foreground/70 font-semibold">Album name</Label>
                                <Input
                                    id="album_name"
                                    placeholder="Some album"
                                    disabled={isSearchEmpty(query) || 'track_name' in query && !query.track_name}
                                    bind:value={
                                        () => query && 'album_name' in query ? query.album_name : '',
                                        v => query = {
                                            ...query,
                                            track_name: query && 'track_name' in query ? query.track_name : '',
                                            album_name: v
                                        }
                                    }
                                />
                            </div>
                        </CardContent>
                        <CardFooter class="flex sm:justify-end">
                            <Button
                                type="submit"
                                class="w-full sm:w-auto"
                                disabled={isSearchEmpty(query) || results.loading}
                            >
                                <SearchIcon/>
                                <span class="hidden sm:inline">Search</span>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            {/if}
            <div class="@3xl:block hidden"></div>
        </form>
        <div class="grid @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 col-span-full gap-2">
            <div
                class={cn(
                    "flex items-center justify-between gap-2",
                    !isAdvancedSearch.current ? "@3xl:col-span-1 col-span-full" : "col-span-full"
                )}
            >
                <p class="text-xs text-muted-foreground flex items-center gap-1">
                    {#if results.loading}
                        <LoaderCircleIcon class="animate-spin size-4"/>
                        <span>Loading...</span>
                    {:else if results.error}
                        <CircleXIcon class="size-4"/>
                        <span>Error: {results.error.message}</span>
                    {:else if !results.current?.length && !isSearchEmpty(query)}
                        <ListIcon class="size-4"/>
                        <span>No results found.</span>
                    {:else if !results.current?.length}
                        <TextCursorInputIcon class="size-4"/>
                        <span>Start typing to search.</span>
                    {:else}
                        <ListIcon class="size-4"/>
                        <span>Showing {results.current.length} result{results.current.length > 1 ? 's' : ''}.</span>
                    {/if}
                </p>
                <Button
                    size="xs"
                    variant="outline"
                    class="rounded-lg bg-input/50!"
                    onclick={() => {
                        isAdvancedSearch.current = !isAdvancedSearch.current;

                        if (!isAdvancedSearch.current) {
                            query = { q: query && 'track_name' in query ? query.track_name : '' };
                        } else {
                            query = {
                                track_name: query && 'q' in query ? query.q : '',
                                artist_name: '',
                                album_name: ''
                            };
                        }
                    }}
                >
                    {#if !query || 'q' in query}
                        <TextSearchIcon/>
                        <span class="hidden sm:inline">Advanced Search</span>
                    {:else}
                        <SearchIcon/>
                        <span class="hidden sm:inline">Simple Search</span>
                    {/if}
                </Button>
            </div>
            <div class="@3xl:block hidden"></div>
        </div>
    </section>
    <div
        class={cn(
            "grid @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 gap-2 col-span-full h-fit",
            isAdvancedSearch.current && "@3xl:col-span-2 @3xl:grid-cols-2"
        )}
    >
        {#if results.loading}
            {#each { length: 20 } as _, index}
                <Skeleton class="w-full h-32 rounded-xl" style="animation-delay: {index * 0.1}s;"/>
            {/each}
        {:else}
            {#each results.current as result (result.id)}
                <Card class="w-full">
                    <CardHeader>
                        <CardTitle class="text-sm">{result.trackName}</CardTitle>
                        <CardDescription class="text-xs text-muted-foreground">
                            {result.artistName} - {result.albumName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="grid gap-1">
                        <p class="text-xs text-muted-foreground">
                            Track ID: {result.id}
                        </p>
                        <p class="text-xs text-muted-foreground">
                            Duration: {result.duration ? `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}
                        </p>
                    </CardContent>
                </Card>
            {/each}
        {/if}
    </div>
</div>