<script lang="ts">
    import { BookIcon, CirclePlayIcon, LibraryIcon, SearchIcon } from '@lucide/svelte';
    import Topbar from '$lib/components/app/Topbar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { page } from '$app/state';
    import { resolve } from '$app/paths';

    let { children } = $props();
</script>

<Topbar/>

<div class="w-full h-[calc(100%-4rem)] flex justify-center">
    <div class="container flex sm:gap-2">
        <div class="sm:w-60 relative shrink-0">
            <aside
                class="fixed sm:left-auto left-0 sm:bottom-auto bottom-0 flex sm:flex-col sm:gap-2 sm:w-60 w-[calc(100%-2rem)] sm:border-0 border rounded-full sm:rounded-none m-4 sm:m-0 overflow-hidden sm:bg-transparent bg-background/75 sm:backdrop-blur-none backdrop-blur-lg z-50"
            >
                <Button
                    variant="ghost"
                    size="lg"
                    class={[
                        "justify-start py-1 px-3 sm:gap-3 gap-1 sm:text-base text-xs",
                        "sm:w-full w-1/4 sm:flex-row flex-col sm:h-fit h-auto sm:rounded-xl rounded-full",
                        page.route.id == '/(app)/search' && "text-primary! sm:bg-muted bg-muted/50"
                    ]}
                    href={resolve('/(app)/search')}
                >
                    <SearchIcon class="text-primary size-5"/>
                    <span>Search</span>
                </Button>
                <Button
                    variant="ghost"
                    size="lg"
                    class={[
                        "justify-start py-1 px-3 sm:gap-3 gap-1 sm:text-base text-xs",
                        "sm:w-full w-1/4 sm:flex-row flex-col sm:h-fit h-auto sm:rounded-xl rounded-full",
                        page.route.id == '/(app)/player' && "text-primary! sm:bg-muted bg-muted/50"
                    ]}
                    href={resolve('/(app)/player')}
                >
                    <CirclePlayIcon class="text-primary size-5"/>
                    <span>Player</span>
                </Button>
                <Button
                    variant="ghost"
                    size="lg"
                    class={[
                        "justify-start py-1 px-3 sm:gap-3 gap-1 sm:text-base text-xs",
                        "sm:w-full w-1/4 sm:flex-row flex-col sm:h-fit h-auto sm:rounded-xl rounded-full",
                        page.route.id == '/(app)' && "text-primary! sm:bg-muted bg-muted/50"
                    ]}
                    href={resolve('/(app)')}
                >
                    <LibraryIcon class="text-primary size-5"/>
                    <span>Library</span>
                </Button>
                <Button
                    variant="ghost"
                    size="lg"
                    class={[
                        "justify-start py-1 px-3 sm:gap-3 gap-1 sm:text-base text-xs",
                        "sm:w-full w-1/4 sm:flex-row flex-col sm:h-fit h-auto sm:rounded-xl rounded-full",
                        page.route.id == '/(app)/docs' && "text-primary! sm:bg-muted bg-muted/50"
                    ]}
                    href={resolve('/(app)/docs')}
                >
                    <BookIcon class="text-primary size-5"/>
                    <span>Docs</span>
                </Button>
            </aside>
        </div>
        <main class="relative size-full">
            {@render children()}
            <div class="h-20 sm:h-0"></div>
        </main>
    </div>
</div>