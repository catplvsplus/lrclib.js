<script lang="ts">
    import { cn } from "$lib/helpers/utils";
    import * as DropdownMenu from '../ui/dropdown-menu';
    import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
    import { Check, Settings } from 'lucide-svelte';
    import { buttonVariants } from '../ui/button';
    import { isBlurAllowed, isPreviewAllowed } from '../../helpers/stores';
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-11 rounded-lg')}>
        <Settings/>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="mx-2 mt-3">
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
            <DropdownMenu.Item onclick={() => $isPreviewAllowed = !$isPreviewAllowed}>
                <Check size=16 class={cn($isPreviewAllowed ? "text-primary" : "text-transparent", "mr-2")}/>
                Lyrics Preview
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>