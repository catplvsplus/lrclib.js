<script lang="ts">
    import { mediaQuery } from "svelte-legos";
    import { lrclib, type Track as LrcTrack } from "lrclib";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Drawer from "$lib/components/ui/drawer/index.js";
    import ViewLyrics from "./ViewLyrics.svelte";
    import ViewLyricsSkeleton from './ViewLyricsSkeleton.svelte';

    export let trackId: string;
    export let open: boolean = false;

    const isDesktop = mediaQuery("(min-width: 768px)");

    let track: Promise<LrcTrack>|null = null;

    $: track = lrclib.cache.has(trackId)
        ? Promise.resolve(lrclib.cache.get(trackId)!)
        : lrclib.fetchId(trackId);

    console.log(trackId);

    $: open, (() => !open ? window.history.back() : null)();
</script>

{#if $isDesktop}
    <Dialog.Root bind:open closeOnOutsideClick>
        <Dialog.Content class="max-w-3xl max-h-screen min-h-80 border-primary/40 dark:border-border">
            {#await track}
                <ViewLyricsSkeleton/>
            {:then data}
                <ViewLyrics track={data} class="max-h-[80dvh] overflow-auto rounded"/>
            {/await}
        </Dialog.Content>
    </Dialog.Root>
{:else}
    <Drawer.Root bind:open closeOnEscape closeOnOutsideClick>
        <Drawer.Content class="max-h-screen min-h-80 px-2">
            {#await track}
                <ViewLyricsSkeleton/>
            {:then data}
                <ViewLyrics track={data} class="max-h-[80dvh] h-screen overflow-auto rounded-md mb-6"/>
            {/await}
        </Drawer.Content>
    </Drawer.Root>
    <style>
        html,
        body {
            overscroll-behavior-y: contain;
        }
    </style>
{/if}
