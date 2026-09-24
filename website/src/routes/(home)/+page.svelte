<script lang="ts">
    import { InputGroup, InputGroupButton, InputGroupInput } from '$lib/components/ui/input-group';
    import { SearchIcon } from '@lucide/svelte';
    import { AUTHOR_URL } from '$lib/helpers/constants';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    let search = $state('');

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
            <InputGroup class="rounded-xl ring-primary/20! focus-within:border-primary! hover:border-primary! hover:shadow-lg focus-within:shadow-lg shadow-primary/20 duration-300 transition-all">
                <InputGroupInput
                    placeholder="Search for a song, artist, or album"
                    type="text"
                    class="placeholder:text-sm px-3"
                    bind:value={search}
                    onkeyup={e => e.key == 'Enter' && onSearch()}
                />
                <InputGroupButton
                    size="icon-sm"
                    class="text-primary! bg-transparent!"
                    onclick={onSearch}
                >
                    <SearchIcon/>
                </InputGroupButton>
            </InputGroup>
        </section>
    </main>
    <footer class="flex justify-center-safe items-center-safe p-4 text-muted-foreground text-xs">
        <span>Made with ❤️ by <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
            @catplvsplus
        </a></span>
    </footer>
</div>