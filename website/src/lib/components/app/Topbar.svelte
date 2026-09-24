<script lang="ts">
    import { BookIcon, EqualIcon, ExternalLinkIcon, HouseIcon, MoonIcon, PlayIcon, SunIcon } from '@lucide/svelte';
    import { mode, toggleMode } from 'mode-watcher';
    import { Button } from '$lib/components/ui/button';
    import { resolve } from '$app/paths';
    import { GITHUB_URL } from '$lib/helpers/constants';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '$lib/components/ui/dropdown-menu';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { cn } from 'cn';

    let scrolling = $state(false);

    onMount(() => {
        handleScroll();
    });

    function handleScroll() {
        scrolling = window.scrollY > 0;
    }
</script>

<svelte:window onscroll={handleScroll}/>

<header
    class={cn(
        "fixed top-0 left-0 w-full flex justify-center z-50",
        scrolling && "bg-background/75 backdrop-blur-lg"
    )}
>
    <div class="flex justify-between items-center-safe w-full gap-4 p-4 container">
        <div class="w-1/3 sm:hidden flex">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {#snippet child({ props })}
                        <Button {...props} variant="ghost" size="icon">
                            <EqualIcon class="size-6"/>
                        </Button>
                    {/snippet}
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-[calc(100vw-1rem)] mx-2 mt-2">
                    <DropdownMenuItem class="py-2 px-3" onclick={() => goto(resolve('/'))}>
                        <HouseIcon/>
                        Home
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem class="py-2 px-3" onclick={() => goto(resolve('/docs'))}>
                        <BookIcon/>
                        Docs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem class="py-2 px-3" onclick={() => goto(resolve('/player'))}>
                        <PlayIcon/>
                        Player
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem class="py-2 px-3" onclick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}>
                        <ExternalLinkIcon/>
                        Github
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <h1 class="w-1/3 sm:text-start text-center text-2xl font-bold tracking-wide">
            <a href={resolve('/(home)')}>
                Lrclib<span class="text-primary">.js</span>
            </a>
        </h1>
        <nav class="w-1/3 sm:flex hidden justify-center text-sm gap-4 font-medium">
            <a href={resolve('/')}>Home</a>
            <a href={resolve('/docs')}>Docs</a>
            <a href={resolve('/player')}>Player</a>
            <a href={GITHUB_URL}>Github</a>
        </nav>
        <div class="w-1/3 flex justify-end">
            <Button variant="outline" size="icon" onclick={() => toggleMode()}>
                {#if mode.current == 'dark'}
                    <SunIcon class="size-4.5"/>
                {:else}
                    <MoonIcon class="size-4.5"/>
                {/if}
            </Button>
        </div>
    </div>
</header>
<div class="h-16"></div>