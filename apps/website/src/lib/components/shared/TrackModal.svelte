<script lang="ts">
    import { MediaQuery } from "svelte/reactivity";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Drawer from "$lib/components/ui/drawer/index.js";
    import type { Track } from 'lrclib';
    import { Badge } from '../ui/badge';
    import LyricsTextView from './LyricsTextView.svelte';
    import { cn } from '../../helpers/utils';

    let {
        track = $bindable(),
        open = $bindable(false),
        ...props
    }: {
        track: Track;
        open: boolean;
        [key: string]: any;
    } = $props();

    const isDesktop = new MediaQuery("(min-width: 768px)");

    $effect(() => {
        if (!open) window.history.back();
    });
</script>

{#snippet Badges()}
    {#if track.isSynced()}
        <Badge variant="outline" class="bg-green-600/10 border-current text-green-600">Synced</Badge>
    {:else}
        <Badge variant="outline">Unsynced</Badge>
    {/if}
    {#if track.isInstrumental()}
        <Badge variant="outline">Instrumental</Badge>
    {/if}
{/snippet}

{#snippet ArtistAlbum()}
    <span title="{track.artistName}">{track.artistName}</span>
    <span class="inline-block mx-0.5">•</span>
    <span title="{track.albumName}">{track.albumName}</span>
{/snippet}

{#if isDesktop.current}
<Dialog.Root bind:open>
    <Dialog.Content class="max-w-3xl max-h-[calc(100%-3rem)] min-h-80 overflow-auto">
        <Dialog.Header class="space-y-0">
            <Dialog.Title class="text-lg font-semibold text-primary">{track.trackName}</Dialog.Title>
            <Dialog.Description class="items-center text-muted-foreground leading-5 text-sm text-ellipsis overflow-hidden">
                {@render ArtistAlbum()}
            </Dialog.Description>
            <div class="flex flex-wrap gap-1 pt-2 pb-4">{@render Badges()}</div>
        </Dialog.Header>
        <LyricsTextView {track}/>
    </Dialog.Content>
</Dialog.Root>
{:else}
<Drawer.Root bind:open>
    <Drawer.Portal>
        <Drawer.Overlay class="fixed inset-0 bg-black/30"/>
        <Drawer.Content class="fixed bottom-0 left-0 flex max-h-[96%] h-[calc(100%-1rem)] flex-col">
            <Drawer.Header class="gap-0 pb-2">
                <Drawer.Title class="text-lg font-semibold text-primary">{track.trackName}</Drawer.Title>
                <Drawer.Description class="flex flex-col gap-2">
                    <div class="items-center text-muted-foreground leading-5 text-sm text-ellipsis overflow-hidden">
                        {@render ArtistAlbum()}
                    </div>
                    <div class="flex flex-wrap gap-1 pb-2 justify-center sm:justify-start">{@render Badges()}</div>
                </Drawer.Description>
            </Drawer.Header>
            <div class="px-4 pb-4 w-full h-[calc(100%-8rem)]">
                <LyricsTextView {track}/>
            </div>
        </Drawer.Content>
    </Drawer.Portal>
</Drawer.Root>
<style>
    html,
    body {
        overscroll-behavior-y: contain;
    }
</style>
{/if}