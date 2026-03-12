<script lang="ts">
    import '@fontsource-variable/inter';
    import '$lib/styles/app.css';
    import { Toaster } from '$lib/components/ui/sonner';
    import { TooltipProvider } from '$lib/components/ui/tooltip';
    import { notifications } from '$lib/helpers/classes/Notifications.svelte';
    import { onDestroy, onMount } from 'svelte';
    import Player from '@/components/shared/player/MiniPlayer.svelte';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import { ModeWatcher } from 'mode-watcher';
    import { pwaInfo } from 'virtual:pwa-info';
    import { useRegisterSW } from 'virtual:pwa-register/svelte';
    import { deepMerge, MetaTags } from 'svelte-meta-tags';
    import { toast } from 'svelte-sonner';

	let { children, data } = $props();

    const sw = useRegisterSW({
        immediate: true,
        onRegistered(r) {
            if (!r) return;

            console.log(`SW Registered: ${r}`);

            setInterval(() => {
                console.log('Checking for sw update');
                r.update();
            }, 20000);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
        onNeedRefresh() {
            console.log('SW needs to be updated');
            toast.info('New update available! Would you like to reload?', {
                action: {
                    label: 'Reload',
                    onClick: () => sw.updateServiceWorker(true)
                }
            });
        },
        onOfflineReady() {
            console.log('SW is offline ready');
            toast.info('App is ready for offline use!');
        }
    });

    onMount(() => {
        player.initialize();
    });

    onDestroy(() => {
        player.destroy();
    });

    let webmanifest = $derived(pwaInfo ? pwaInfo.webManifest : '');
</script>

<svelte:head>
    <link rel="search" type="application/opensearchdescription+xml" title="Lrclib.js Lyrics" href="{resolve('/(main)/search/search.xml')}" />
    {@html webmanifest}
</svelte:head>
<svelte:document
    on:visibilitychange={() => {
        if (document.visibilityState === 'visible') notifications.clear();
    }}
/>

<MetaTags {...deepMerge(data.baseMetaTags, page.data.pageMetaTags)}/>
<Player/>
<ModeWatcher/>
<Toaster
    position={userInterface.smallScreen.current && userInterface.menuMode === 'bottom' ? 'top-center' : 'bottom-right'}
    mobileOffset={{
        top: userInterface.smallScreen.current && userInterface.menuMode === 'bottom' ? '4rem' : 0
    }}
/>

<TooltipProvider>
    {@render children?.()}
</TooltipProvider>
<input type="file" accept="audio/*" multiple onchange={e => e.currentTarget.files && player.addTracksFromFiles(e.currentTarget.files)} bind:this={player.filesInput} style="display: none"/>
