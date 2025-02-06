<script lang="ts">
    import { base } from '$app/paths';
    import { cn } from "$lib/helpers/utils";
    import { Github } from 'lucide-svelte';
    import { isBlurAllowed } from '../../helpers/stores';
    import { buttonVariants } from '../ui/button';
    import SearchBox from './SearchBox.svelte';
    import AppearanceSettings from './AppearanceSettings.svelte';
    import { fly, type FlyParams, type TransitionConfig } from 'svelte/transition';

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

    function animate(element: Element, options: FlyParams): TransitionConfig {
        return useAnimation ? fly(element, options) : {};
    }
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
        <h1 class={cn("text-2xl font-semibold tracking-tight", useTransparency && 'text-white dark')}>
            <a href="{base}/">
                Lrclib<span class="text-primary">.js</span>
            </a>
        </h1>
        <div class="w-full flex gap-2 justify-end">
            {#if addSearchBox}
                <SearchBox class="max-w-96" bind:value/>
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
    </div>
</div>