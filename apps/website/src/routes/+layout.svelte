<script lang="ts">
	import '$lib/styles/app.pcss';
    import { onMount } from 'svelte';
    import { Toaster } from '../lib/components/ui/sonner';
    import { toast } from 'svelte-sonner';
    import { ModeWatcher, toggleMode } from 'mode-watcher';

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

    onMount(() => updateServiceWorker());
</script>

<Toaster/>
<ModeWatcher defaultMode="system"/>
{@render children()}
