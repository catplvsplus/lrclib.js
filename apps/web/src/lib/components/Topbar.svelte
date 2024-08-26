<script lang="ts">
    import { Input } from './ui/input';
    import ThemeSwitcher from './ThemeSwitcher.svelte';
    import { Button } from './ui/button';
    import { Links } from '../helpers/constants';
    import Github from 'lucide-svelte/icons/github';
    import { search } from '../stores/search';
    import SearchInput from './SearchInput.svelte';
    import { onMount } from 'svelte';
    import { cn } from '../helpers/utils';

    let searching: boolean = false;
    let minimized: boolean = false;

    function onRezise() {
        minimized = window.innerWidth <= 375;
    }
</script>

<svelte:window on:resize={onRezise}/>

<header class="flex justify-center items-center w-full h-14 py-2 px-3 fixed bg-background/90 backdrop-blur-lg backdrop-saturate-200 border-b z-50">
    <div class="flex justify-between items-center w-full max-w-7xl" class:searching>
        <h1 class="text-xl font-medium shrink-0 mr-4 title">
            <a href="/">
                Lrclib<span class="text-primary font-bold">.js</span>
            </a>
        </h1>
        <div class="w-full px-1 form flex">
            <SearchInput bind:focused={searching} mini class={cn("max-w-72", minimized ? "minimized" : "")}/>
        </div>
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

            .form :global(form) {
                max-width: unset;
            }
        }
    }

    .form {
        justify-content: end;
    }
</style>