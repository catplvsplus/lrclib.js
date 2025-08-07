<script lang="ts">
    import { resolve } from '$app/paths';
    import { cn } from '$lib/helpers/utils';
    import { page } from '$app/state';
    import { Button, type ButtonProps } from '../../ui/button';
    import { CirclePlus, DownloadIcon, HeartIcon, MenuIcon, PencilRulerIcon, SearchIcon } from '@lucide/svelte';
    import { MediaQuery } from 'svelte/reactivity';

    let scrollY = $state(0);
    let pathname = $derived(page.url.pathname);
    let smallScreen = new MediaQuery('(max-width: 639px)');
</script>

<svelte:window bind:scrollY/>

{#snippet SidebarContent({ hideTitle, ...props }: ButtonProps & { hideTitle?: boolean; } = {})}
    <Button {...props} href={resolve('/(main)/lyrics')}>
        <SearchIcon/>
        <span class:hidden={hideTitle}>Search</span>
    </Button>
    <Button {...props} href={resolve('/(main)/likes')}>
        <HeartIcon/>
        <span class:hidden={hideTitle}>Likes</span>
    </Button>
    <Button {...props} href={resolve('/(main)/saves')}>
        <DownloadIcon/>
        <span class:hidden={hideTitle}>Saves</span>
    </Button>
    <Button {...props} href={resolve('/(main)/publish')}>
        <CirclePlus/>
        <span class:hidden={hideTitle}>Publish</span>
    </Button>
{/snippet}

<div class="w-0 sm:w-56 shrink-0"></div>
<div
    class={cn(
        "fixed shrink-0 z-50",
        smallScreen.current
            ? "bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t"
            : "top-16 left-auto w-56 h-[calc(100%-4rem)]",
    )}
>
    <div
        class={cn(
            "relative w-full h-full flex",
            smallScreen.current
                ? "flex gap-2 justify-around p-1 items-center"
                : "pt-8 pr-4 border-r border-transparent flex-col gap-2"
        )}
    >
        {@render SidebarContent({
            class: cn(
                '[&_svg]:text-primary [&_svg]:size-5! font-semibold',
                smallScreen.current
                    ? 'flex-col items-center w-full shrink h-fit [&_svg]:size-6! text-xs gap-1 text-foreground/80'
                    : 'w-full justify-start [&_svg]:mr-1 text-base text-foreground/80'
            ),
            variant: 'ghost',
        })}
    </div>
</div>