<script lang="ts">
	import '$lib/styles/app.pcss';
    import '$lib/styles/global.scss';
    import { onMount } from 'svelte';
    import { Toaster } from '../lib/components/ui/sonner';
    import { toast } from 'svelte-sonner';
    import { ModeWatcher } from 'mode-watcher';
    import { isMobile } from 'is-mobile';
    import { isBlurAllowed } from '../lib/helpers/stores';
    import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
    import PageLoading from '../lib/components/shared/PageLoading.svelte';

	let { children } = $props();

    let isNavigating = $state(false);

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

        $isBlurAllowed = !isMobile() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    beforeNavigate(() => {
        isNavigating = true;
    });

    afterNavigate(() => {
        isNavigating = false;
    })
</script>

<Toaster/>
{#if isNavigating}
    <PageLoading/>
    <style>
        main {
            overflow: hidden;
        }
    </style>
{/if}
<main class="w-full h-full bg-background" data-vaul-drawer-wrapper="">
    <ModeWatcher defaultMode="system"/>
    {@render children()}
</main>
