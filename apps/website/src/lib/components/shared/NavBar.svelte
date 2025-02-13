<script lang="ts">
    import { base } from '$app/paths';
    import { cn } from "$lib/helpers/utils";
    import { ArrowLeft, Github, Search } from 'lucide-svelte';
    import { isBlurAllowed } from '../../helpers/stores';
    import { Button, buttonVariants } from '../ui/button';
    import SearchBox from './SearchBox.svelte';
    import AppearanceSettings from './AppearanceSettings.svelte';
    import { fly, type FlyParams, type TransitionConfig } from 'svelte/transition';
    import { MediaQuery } from 'svelte/reactivity';
    import { page } from '$app/state';
    import { pushState } from '$app/navigation';
    import { onClickOutside } from 'runed';

    let {
        addSearchBox = true,
        useAnimation = false,
        useTransparency = false,
        value = $bindable(""),
        ...props
    }: {
        addSearchBox?: boolean;
        useAnimation?: boolean;
        useTransparency?: boolean;
        value?: string;
        [key: string]: any;
    } = $props();

    let isSmallScreen = new MediaQuery("(max-width: 520px)");
    let container: HTMLDivElement = $state()!;

    function animate(element: Element, options: FlyParams): TransitionConfig {
        return useAnimation ? fly(element, options) : {};
    }

    $effect(() => {
        if (!isSmallScreen.current && page.state.isSearching) pushState('', { isSearching: false });
    });

    function openSearch() {
        pushState('', { isSearching: true });
    }

    onClickOutside(
		() => container,
		() => {
            if (page.state.isSearching) pushState('', { isSearching: false });
        }
	);
</script>

<div
    out:animate={{ y: -65, opacity: 1 }}
    in:animate={{ y: -65, opacity: 1 }}
    {...props}
    class={cn(
        "h-16 w-full fixed top-0 left-0 z-50 border-b flex justify-center",
        useTransparency
            ? 'bg-transparent border-transparent' 
            : $isBlurAllowed
                ? 'backdrop-blur-lg bg-background/70'
                : 'bg-background',
        props.class
    )}
>
    <div class="flex items-center justify-between gap-5 w-full max-w-screen-2xl px-5">
        {#if isSmallScreen.current && page.state.isSearching}
            <div class="h-full w-full absolute top-0 left-0 z-10 p-2 flex gap-2 items-center" transition:fly={{ y: -65, duration: 500 }} bind:this={container}>
                <Button variant="outline" size="icon" class="h-11 w-11 shrink-0" onclick={() => pushState('', { isSearching: false })}>
                    <ArrowLeft/>
                </Button>
                <SearchBox class="w-full" bind:value autofocus/>
            </div>
            <style>
                html {
                    overflow: hidden;
                }
            </style>
        {:else}
            <h1 class={cn("text-2xl font-semibold tracking-tight", useTransparency && 'text-white dark')}>
                <a href="{base}/">
                    Lrclib<span class="text-primary">.js</span>
                </a>
            </h1>
            <div class="w-full flex gap-2 justify-end">
                {#if addSearchBox}
                    {#if !isSmallScreen.current}
                        <SearchBox class="max-w-96" bind:value/>
                    {:else}
                        <Button
                            variant="outline"
                            size="icon"
                            class={cn(
                                "h-11 w-11 rounded-lg bg-background/30",
                                useTransparency && 'border-transparent bg-transparent hover:bg-background/70 text-white dark'
                            )}
                            onclick={openSearch}
                        >
                            <Search/>
                        </Button>
                    {/if}
                {/if}
                <a
                    href="http://github.com/catplvsplus/lrclib.js"
                    target="_blank"
                    rel="noopener noreferrer"
                    class={cn(
                        buttonVariants({ variant: 'outline' }),
                        'h-11 w-11 rounded-lg bg-background/30',
                        useTransparency && 'border-transparent bg-transparent hover:bg-background/70 text-white dark'
                    )}
                >
                    <Github/>
                </a>
                <AppearanceSettings class={useTransparency && 'border-transparent bg-transparent hover:bg-background/70 text-white dark'}/>
            </div>
        {/if}
    </div>
</div>