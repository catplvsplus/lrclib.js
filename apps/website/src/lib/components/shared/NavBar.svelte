<script lang="ts">
    import { base } from '$app/paths';
    import { cn } from "$lib/helpers/utils";
    import { Github } from 'lucide-svelte';
    import { isBlurAllowed } from '../../helpers/stores';
    import { buttonVariants } from '../ui/button';
    import SearchBox from './SearchBox.svelte';
    import AppearanceSettings from './AppearanceSettings.svelte';
</script>
<div
    class={cn(
        "h-16 w-full fixed top-0 left-0 z-50 border-b flex justify-center",
        $isBlurAllowed ? 'backdrop-blur-xl bg-background/80' : 'bg-background'
    )}
>
    <div class="flex items-center justify-between gap-5 w-full max-w-screen-2xl px-5">
        <h1 class="text-2xl font-medium">
            <a href="{base}">
                Lrclib<span class="text-primary">.js</span>
            </a>
        </h1>
        <div class="w-full flex gap-2 justify-end">
            <SearchBox class="max-w-96"/>
            <a href="http://github.com/catplvsplus/lrclib.js" target="_blank" rel="noopener noreferrer" class={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-11 rounded-lg')}>
                <Github/>
            </a>
            <AppearanceSettings/>
        </div>
    </div>
</div>