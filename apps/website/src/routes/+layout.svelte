<script lang="ts">
	import '$lib/styles/app.css';
    import { ModeWatcher } from 'mode-watcher';
    import { Toaster } from '$lib/components/ui/sonner/index';
    import { toast } from 'svelte-sonner';
    import { TooltipProvider } from '../lib/components/ui/tooltip';
    import { notifications } from '../lib/helpers/classes/Notifications.svelte';
    import { onDestroy, onMount } from 'svelte';
    import Player from '../lib/components/shared/player/Player.svelte';
    import { userInterface } from '../lib/helpers/classes/UserInterface.svelte';
    import { player } from '../lib/helpers/classes/Player.svelte';

	let { children } = $props();

    async function updateServiceWorker() {
        const registration = await navigator.serviceWorker.ready;

        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker?.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    toast.info('New update is available!', {
                        duration: 60000,
                        action: {
                            label: 'Reload',
                            onClick: () => {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                }
            });
        });
    }

    onMount(() => {
        updateServiceWorker();
        player.initialize();
    });

    onDestroy(() => {
        player.destroy();
    });
</script>

<Player/>
<ModeWatcher/>
<Toaster position={userInterface.smallScreen.current && userInterface.menuMode === 'bottom' ? 'top-center' : 'bottom-right'}/>

<svelte:head>
    <title>Lrclib.js</title>
</svelte:head>

<svelte:document
    on:visibilitychange={() => {
        if (document.visibilityState === 'visible') notifications.clear();
    }}
/>

<TooltipProvider>
    {@render children?.()}
</TooltipProvider>
