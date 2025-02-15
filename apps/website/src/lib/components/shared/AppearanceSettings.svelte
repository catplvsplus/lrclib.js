<script lang="ts">
    import { cn } from "$lib/helpers/utils";
    import * as DropdownMenu from '../ui/dropdown-menu';
    import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
    import { Check, Settings } from 'lucide-svelte';
    import { buttonVariants } from '../ui/button';
    import { isBlurAllowed } from '../../helpers/stores';
    import type { ComponentType } from 'svelte';

    let { icon = Settings, useTransparency = false, ...props}: { icon?: ComponentType; useTransparency?: boolean; [key: string]: any; } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger {...props} class={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-11 rounded-lg bg-background/50', props.class)}>
        <!-- svelte-ignore svelte_component_deprecated -->
        <svelte:component this={icon} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content
        class={cn(
            "mx-2 mt-3",
            useTransparency
                ? 'bg-transparent border-transparent' 
                : $isBlurAllowed
                    ? 'backdrop-blur-lg dark:bg-background/70 dark:border-border/60 bg-background/50 border-border/40'
                    : 'bg-background',
        )}
    >
        <DropdownMenu.Group>
            <DropdownMenu.Item onclick={() => setMode("light")}>
                <Check size=16 class={cn($userPrefersMode === 'light' ? "text-primary" : "text-transparent", "mr-2")}/>
                Light
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => setMode("dark")}>
                <Check size=16 class={cn($userPrefersMode === 'dark' ? "text-primary" : "text-transparent", "mr-2")}/>
                Dark
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => resetMode()}>
                <Check size=16 class={cn($userPrefersMode === 'system' ? "text-primary" : "text-transparent", "mr-2")}/>
                System
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={() => $isBlurAllowed = !$isBlurAllowed}>
                <Check size=16 class={cn($isBlurAllowed ? "text-primary" : "text-transparent", "mr-2")}/>
                Enable Blur
            </DropdownMenu.Item>
            {@render props.children?.()}
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>