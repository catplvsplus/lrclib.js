<script lang="ts">
    import { cn, type ClassValue } from 'cn';
    import type { APIOptions, Track } from 'lrclib.js';
    import type { PersistedState, ResourceReturn } from 'runed';
    import { InputGroup, InputGroupButton, InputGroupInput } from '../ui/input-group';
    import { isSearchEmpty } from '../../helpers/utils';
    import { SearchIcon, TextCursorInputIcon } from '@lucide/svelte';
    import ImportMetadata from './ImportMetadata.svelte';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
    import { Label } from '../ui/label';
    import { Input } from '../ui/input';
    import { Button } from '../ui/button';

    let {
        query = $bindable(null),
        results,
        isAdvancedSearch,
        class: className = ''
    }: {
        query: APIOptions.Get.Search|null;
        results: ResourceReturn<Track[], string>;
        isAdvancedSearch: PersistedState<boolean>;
        class?: ClassValue;
    } = $props();
</script>

<form
    class={cn("sticky grid @2xl:grid-cols-2 @3xl:grid-cols-3 grid-cols-1 gap-4", className)}
    onsubmit={event => {
        event.preventDefault();
        results.refetch();
    }}
>
    {#if !isAdvancedSearch.current}
        <InputGroup
            class={[
                "h-8.5 rounded-xl bg-input/50! ring-primary/20! focus-within:border-primary! hover:border-primary! hover:shadow-lg focus-within:shadow-lg shadow-primary/20 opacity-100! duration-300 transition-all",
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
                        <TextCursorInputIcon class="text-primary size-5"/>
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
                        <span>Search</span>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    {/if}
    <div class={cn(isAdvancedSearch ? "hidden" : "@3xl:block hidden")}></div>
</form>