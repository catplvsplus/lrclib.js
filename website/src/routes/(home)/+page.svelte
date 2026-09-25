<script lang="ts">
    import { InputGroup, InputGroupButton, InputGroupInput } from '$lib/components/ui/input-group';
    import { ListSortDescendingIcon, LoaderCircleIcon, SearchIcon, TextCursorInputIcon } from '@lucide/svelte';
    import { AUTHOR_URL } from '$lib/helpers/constants';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { resource } from 'runed';
    import lrclib from 'lrclib.js';
    import { Button } from '../../lib/components/ui/button';
    import { fly } from 'svelte/transition';

    let search = $state('');
    let isFocused = $state(false);
    let autocompleteIndex = $state(-1);
    let autocompleteContainer: HTMLDivElement|null = $state(null);
    let results = resource(
        () => search,
        async (search) => {
            if (!search.trim()) return [];

            const results = lrclib
                .search(search.trim())
                .then(r => r.splice(0, 5))
                .catch(() => []);

            autocompleteIndex = -1;

            return results;
        },
        {
            debounce: 100,
            throttle: 500,
            lazy: true
        }
    );

    let focusTimeout: NodeJS.Timeout|null = null;

    function onSearch() {
        goto(`${resolve('/(app)/search')}?q=${encodeURIComponent(search.trim())}`);
    }
</script>

<div class="size-full flex flex-col justify-between">
    <span class="invisible"></span>
    <main class="flex justify-center-safe items-center-safe flex-col gap-5 w-full">
        <section class="grid gap-4 text-center">
            <h1 class="sm:text-7xl text-6xl tracking-wide font-bold text-shadow-lg text-shadow-current/20">
                Lrclib<span class="text-primary">.js</span>
            </h1>
            <p class="sm:text-base text-sm font-medium text-muted-foreground">
                A library for interacting with lrclib.net API
            </p>
        </section>
        <section class="w-full p-4 max-w-lg min-h-48">
            <InputGroup class="relative rounded-xl ring-primary/20! focus-within:border-primary! hover:border-primary! hover:shadow-lg focus-within:shadow-lg shadow-primary/20 duration-300 transition-all">
                <InputGroupInput
                    placeholder="Search for a song, artist, or album"
                    type="text"
                    class="placeholder:text-sm px-3"
                    bind:value={search}
                    onfocus={() => {
                        if (focusTimeout) clearTimeout(focusTimeout);
                        isFocused = true;
                    }}
                    onblur={() => {
                        if (focusTimeout) clearTimeout(focusTimeout);
                        focusTimeout = setTimeout(() => isFocused = false, 100);
                    }}
                    onkeydown={e => {
                        switch (e.key) {
                            case 'Enter':
                                if (autocompleteIndex >= 0 && results.current?.length) {
                                    const selectedResult = results.current[autocompleteIndex];

                                    if (selectedResult) {
                                        goto(resolve('/(app)/track/[id]', { id: String(selectedResult.id) }));
                                    }
                                } else {
                                    onSearch();
                                }
                                break;
                            case 'ArrowDown':
                                if (results.current?.length) {
                                    e.preventDefault();
                                    autocompleteIndex = (autocompleteIndex + 1) % results.current.length;
                                }
                                break;
                            case 'ArrowUp':
                                if (results.current?.length) {
                                    e.preventDefault();
                                    autocompleteIndex = (autocompleteIndex - 1 + results.current.length) % results.current.length;
                                }
                                break;
                        }
                    }}
                />
                <InputGroupButton
                    size="icon-sm"
                    class="text-primary! bg-transparent!"
                    onclick={onSearch}
                >
                    <SearchIcon/>
                </InputGroupButton>
                {#if isFocused}
                    <div
                        bind:this={autocompleteContainer}
                        transition:fly={{ y: 5, duration: 150 }}
                        class="absolute top-full left-0 grid border rounded-xl bg-background mt-1 w-full max-h-48 overflow-y-auto shadow z-10"
                    >
                        {#if results.loading}
                            <p class="text-xs text-muted-foreground px-3 py-2 flex items-center gap-1">
                                <LoaderCircleIcon class="animate-spin size-3.5"/>
                                Loading...
                            </p>
                        {:else if !results.current?.length && search.trim()}
                            <p class="text-xs text-muted-foreground px-3 py-2 flex items-center gap-1">
                                <ListSortDescendingIcon class="size-3.5"/>
                                No results found.
                            </p>
                        {:else if !results.current?.length}
                            <p class="text-xs text-muted-foreground px-3 py-2 flex items-center gap-1">
                                <TextCursorInputIcon class="size-3.5"/>
                                Start typing to search.
                            </p>
                        {:else}
                            {#each results.current as result, index (result.id)}
                                {@const isSelected = index === autocompleteIndex}
                                <Button 
                                    variant="ghost"
                                    class={[
                                        "block text-sm w-full line-clamp-2 whitespace-normal text-start h-fit py-1 rounded-xl",
                                        isSelected ? 'bg-primary/10 text-primary autocomplete-item' : 'text-foreground',
                                    ]}
                                    href={resolve('/(app)/track/[id]', { id: String(result.id) })}
                                >
                                    <span class="text-primary">{result.trackName}</span> <span class="text-xs">by {result.artistName}</span>
                                </Button>
                            {/each}
                        {/if}
                    </div>
                {/if}
            </InputGroup>
        </section>
    </main>
    <footer class="flex justify-center-safe items-center-safe p-4 text-muted-foreground text-xs">
        <span>Made with ❤️ by <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
            @catplvsplus
        </a></span>
    </footer>
</div>