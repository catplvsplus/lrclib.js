<script lang="ts">
    import ThemeSwitcher from './ThemeSwitcher.svelte';
    import { Button } from './ui/button';
    import { Links } from '../helpers/constants';
    import Github from 'lucide-svelte/icons/github';
    import SearchInput from './SearchInput.svelte';
    import { cn } from '../helpers/utils';
    import { enableBlur } from '../stores/enableBlur';
    import { base } from '$app/paths';

    export let transparent: boolean = false;

    let searching: boolean = false;
    let minimized: boolean = false;

    function onRezise() {
        minimized = window.innerWidth <= 375;
    }
</script>

<svelte:window on:resize={onRezise}/>

<header
    {...$$props}
    class={cn(
        "flex justify-center items-center w-full h-14 py-2 px-3 fixed border-b z-50",
        $enableBlur && !transparent
            ? "bg-background/50 backdrop-blur-lg backdrop-saturate-200"
            : "bg-background",
        transparent
            ? "bg-transparent border-transparent backdrop-saturate-100"
            : "",
        $$props.class
    )}
>
    <div class="flex justify-between items-center w-full max-w-7xl" class:searching>
        <h1 class={cn("text-xl font-medium shrink-0 mr-4 title", transparent ? "text-white" : "")}>
            <a href="{base}/">
                Lrclib<span class="text-primary font-bold">.js</span>
            </a>
        </h1>
        <div class="w-full px-1 form flex">
            <SearchInput
                bind:focused={searching}
                mini
                class={cn(
                    "max-w-72",
                    minimized
                        ? "minimized"
                        : "",
                    transparent
                        ? "text-white border-transparent !bg-background/10 dark:border-border/50 dark:!bg-background/50"
                        : ""
                )}
            />
        </div>
        <div class="flex gap-1 shrink-0 actions">
            <Button
                variant="outline"
                size="icon"
                on:click={() => window.open(Links.github, "_blank")}
                class={cn(transparent ? "text-white border-transparent bg-background/10 dark:!bg-background/50 hover:bg-background/30 hover:text-white" : "")}
            >
                <Github size="17"/>
            </Button>
            <ThemeSwitcher class={cn(transparent ? "text-white border-transparent bg-background/10 dark:!bg-background/50 hover:bg-background/30 hover:text-white" : "")}/>
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