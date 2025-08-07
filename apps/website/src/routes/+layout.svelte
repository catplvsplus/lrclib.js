<script lang="ts">
	import '$lib/styles/app.css';
    import { ModeWatcher } from 'mode-watcher';
    import { Toaster } from '$lib/components/ui/sonner/index';
    import { toast } from 'svelte-sonner';
    import { TooltipProvider } from '../lib/components/ui/tooltip';
    import { notifications } from '../lib/helpers/classes/Notifications.svelte';

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

    $effect(() => {
        updateServiceWorker();
    });
</script>

<ModeWatcher/>
<Toaster richColors/>

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
