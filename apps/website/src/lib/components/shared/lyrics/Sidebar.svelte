<script lang="ts">
    import { resolve } from '$app/paths';
    import { cn } from '$lib/helpers/utils';
    import { page } from '$app/state';
    import { Button, type ButtonProps } from '../../ui/button';
    import { CirclePlus, LibraryIcon, SearchIcon, ComponentIcon } from '@lucide/svelte';
    import { MediaQuery } from 'svelte/reactivity';
    import { settings } from '../../../helpers/classes/Settings.svelte';

    let scrollY = $state(0);
    let pathname = $derived(page.url.pathname);
    let smallScreen = new MediaQuery('(max-width: 639px)');
</script>

<svelte:window bind:scrollY/>

{#snippet SidebarContent({ hideTitle, ...props }: ButtonProps & { hideTitle?: boolean; } = {})}
    {#snippet SidebarButton(path: typeof pathname, href: string, icon: typeof ComponentIcon, title: string)}
        {@const isActive = pathname === path}
        {@const Icon = icon}
        <Button {...props} {href} data-active={isActive ? 'true' : undefined}>
            <Icon/>
            <span class:hidden={hideTitle}>{title}</span>
            <div
                class={cn(
                    "sm:hidden absolute -bottom-1 rounded-full left-1/2 -translate-x-1/2 h-0.5 ",
                    !settings.prefersReducedMotion && "transition-all duration-300",
                    isActive
                        ? "w-9 bg-primary"
                        : "w-4 bg-transparent"
                )}
            ></div>
        </Button>
    {/snippet}
    {@render SidebarButton('/search', resolve('/(main)/search'), SearchIcon, 'Search')}
    {@render SidebarButton('/publish', resolve('/(main)/publish'), CirclePlus, 'Publish')}
    {@render SidebarButton('/library', resolve('/(main)/library'), LibraryIcon, 'Library')}
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
                '[&_svg]:text-primary [&_svg]:size-5! font-semibold relative hover:bg-black/5',
                smallScreen.current
                    ? [
                        'flex-col items-center w-full shrink h-fit [&_svg]:size-6! text-xs gap-1 text-foreground/70 hover:bg-transparent',
                        'data-[active]:text-primary',
                    ]
                    : [
                        'w-full justify-start [&_svg]:mr-1 text-base text-foreground/80',
                        'dark:data-[active]:bg-muted/60 dark:data-[active]:text-foreground data-[active]:bg-primary/10 data-[active]:text-primary',
                    ]
            ),
            variant: 'ghost',
        })}
    </div>
</div>