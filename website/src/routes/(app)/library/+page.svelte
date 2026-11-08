<script lang="ts">
    import { SearchIcon, LoaderCircleIcon, TextSearchIcon, CircleXIcon, ListIcon, TextCursorInputIcon } from '@lucide/svelte';
    import { Track, type APIOptions, type APIResponse } from 'lrclib.js';
    import { PersistedState, resource } from 'runed';
    import { isSearchEmpty, encodeURISearchQuery } from '#lib/helpers/utils.js';
    import { goto } from '$app/navigation';
    import { Button } from '#lib/components/ui/button/index.js';
    import { Skeleton } from '#lib/components/ui/skeleton/index.js';
    import TrackCard from '#lib/components/app/TrackCard.svelte';
    import { onMount } from 'svelte';
    import { cn } from 'cn';
    import SearchForm from '#lib/components/app/SearchForm.svelte';
    import storage from '../../../lib/helpers/storage.js';

    let { data } = $props();

    let query: APIOptions.Get.Search|null = $derived(data.query);

    let results = resource(
        () => query,
        async (query, prev, { signal }) => {
            goto(encodeURISearchQuery(query), { reset: false })

            const tracks: (Track|APIResponse.Get.TrackSignature)[] = [];

            if (isSearchEmpty(query)) {
                tracks.push(...await storage.getAllTracks());
            } else {
                tracks.push(...await storage.queryTracks(query));
            }

            return tracks.map(track => new Track(track));
        },
        {
            debounce: 1000
        }
    );

    const isAdvancedSearch = new PersistedState('advanced-search', false);

    onMount(() => {
        if (isSearchEmpty(query)) {
            query = null;
        } else if ('q' in query) {
            isAdvancedSearch.current = false;
        } else {
            isAdvancedSearch.current = true;
        }
    });

    export const snapshot = {
        capture: () => ({
            query,
            results: results.current
        }),
        restore: snapshot => {
            query = snapshot.query;
            results.mutate(snapshot.results);
        }
    };
</script>

<div class="grid gap-4 @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 sm:pl-0 px-4 pb-4">
    <section
        class={cn(
            "grid gap-2 col-span-full",
            isAdvancedSearch.current && "@3xl:col-span-1 h-fit"
        )}
    >
        <SearchForm bind:query {results} {isAdvancedSearch}/>
        <div class="grid @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 col-span-full gap-4">
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
                        <span>Advanced Search</span>
                    {:else}
                        <SearchIcon/>
                        <span>Simple Search</span>
                    {/if}
                </Button>
            </div>
            <div class={cn(isAdvancedSearch ? "hidden" : "@3xl:block hidden")}></div>
        </div>
    </section>
    <div
        class={cn(
            "grid @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 gap-4 col-span-full h-fit",
            isAdvancedSearch.current && "@3xl:col-span-2 @3xl:grid-cols-2"
        )}
    >
        {#if results.loading}
            {#each { length: 20 } as _, index}
                <Skeleton class="w-full h-32 rounded-xl" style="animation-delay: {index * 0.1}s;"/>
            {/each}
        {:else}
            {#each results.current as track (track.id)}
                <TrackCard {track}/>
            {/each}
        {/if}
    </div>
</div>