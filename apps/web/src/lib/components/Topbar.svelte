<script lang="ts">
    import { Input } from './ui/input';
    import ThemeSwitcher from './ThemeSwitcher.svelte';
    import { Button } from './ui/button';
    import { Links } from '../helpers/constants';
    import Github from 'lucide-svelte/icons/github';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { parseSearchParams } from '../helpers/utils';
    import { search } from '../stores/search';

    let searching: boolean = false;

    onMount(() => {
        $search = parseSearchParams(window.location.search).q || '';
    });
</script>

<header class="flex justify-center items-center w-full h-14 py-2 px-3 fixed bg-background/90 backdrop-blur-lg backdrop-saturate-200 border-b z-50">
    <div class="flex justify-between items-center w-full max-w-6xl" class:searching>
        <h1 class="text-xl font-medium shrink-0 mr-4 title">
            <a href="/">
                Lrclib<span class="text-primary font-bold">.js</span>
            </a>
        </h1>
        <form class="w-full px-1" on:submit|preventDefault={() => $search.trim() &&goto(`/search?q=${encodeURIComponent($search)}`)}>
            <Input
                placeholder="Search"
                type="search"
                autocomplete="off"
                aria-autocomplete="none"
                class="max-w-72 bg-foreground/20 dark:bg-background search"
                on:focus={() => searching = true}
                on:blur={() => searching = false}
                bind:value={$search}
            />
        </form>
        <div class="flex gap-1 shrink-0 actions">
            <Button variant="outline" size="icon" on:click={() => window.open(Links.github, "_blank")}>
                <Github size="17"/>
            </Button>
            <ThemeSwitcher/>
        </div>
    </div>
</header>

<style lang="scss">
    @media (max-width: 375px) {
        header .searching {
            .title,
            .actions{
                display: none;
            }

            form :global(input) {
                max-width: unset;
            }
        }
    }
</style>