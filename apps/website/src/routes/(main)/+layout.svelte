<script lang="ts">
    import Sidebar from '@/components/shared/main/Sidebar.svelte';
    import Topbar from '@/components/shared/Topbar.svelte';
    import { cn } from '$lib/helpers/utils';
    import GradientBackground from '@/components/shared/GradientBackground.svelte';
    import { toast } from 'svelte-sonner';
    import { resolve } from '$app/paths';
    import { goto } from '$app/navigation';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import FullscreenLyrics from '$lib/components/shared/preview/FullscreenLyrics.svelte';

    let { children } = $props();

    function onOnline() {
        toast.dismiss('offline');
    }

    function onOffline() {
        toast.warning('Connection lost', {
            description: 'View your offline lyrics in library',
            duration: Infinity,
            action: {
                label: 'Go to library',
                onClick: () => {
                    goto(resolve('/(main)/library'));
                }
            },
            id: 'offline'
        });
    }
</script>

<svelte:window ononline={onOnline} onoffline={onOffline}/>

<Topbar/>
<FullscreenLyrics/>
<div
    class={cn(
        "min-h-full pt-16 flex justify-center pb-20",
        player.playing && "pb-36"
    )}
>
    <GradientBackground/>
    <main class="container sm:pt-4 sm:pl-4 flex gap-4 z-10">
        <Sidebar/>
        <div class="w-full p-4 pl-0">
            {@render children?.()}
        </div>
    </main>
</div>