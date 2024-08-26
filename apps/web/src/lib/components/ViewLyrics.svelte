<script lang="ts">
    import type { Track as LrcTrack } from "lrclib";
    import Track from "./Track.svelte";
    import * as Tabs from './ui/tabs';
    import * as Card from './ui/card';
    import { cn } from '../helpers/utils';
    import CopyButton from './CopyButton.svelte';

    export let track: LrcTrack;

    let syncedLyricsContainer: HTMLDivElement;
    let plainLyricsContainer: HTMLDivElement;
</script>

<div {...$$props} class={cn("flex flex-col", $$props.class)}>
    <Track
        {track}
        class="bg-transparent rounded-none shrink-0"
    />
    <Tabs.Root value={track.isSynced ? 'synced' : 'plain'} class="w-full h-full">
        <Tabs.List class="grid w-full grid-cols-2 bg-black/15 dark:bg-muted">
            <Tabs.Trigger value="synced" class='data-[state="active"]:!text-primary data-[state="active"]:font-bold data-[state="active"]:!bg-primary/10' disabled={!track.isSynced}>Synced Lyrics</Tabs.Trigger>
            <Tabs.Trigger value="plain" class='data-[state="active"]:!text-primary data-[state="active"]:font-bold data-[state="active"]:!bg-primary/10' disabled={!track.isPlain}>Plain Lyrics</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="synced">
            <Card.Root class="bg-black/15 dark:bg-muted">
                <Card.Content class="p-4 relative">
                    <div class="absolute top-0 right-0 m-2 z-20">
                        <CopyButton text={track.syncedLyrics} select={syncedLyricsContainer} class="w-full"/>
                    </div>
                    <div class="whitespace-pre select-text overflow-auto" bind:this={syncedLyricsContainer}>{track.syncedLyrics}</div>
                </Card.Content>
            </Card.Root>
        </Tabs.Content>
        <Tabs.Content value="plain">
            <Card.Root class="bg-black/15 dark:bg-muted">
                <Card.Content class="p-4 relative">
                    <div class="absolute top-0 right-0 m-2 z-20">
                        <CopyButton text={track.plainLyrics} select={plainLyricsContainer} class="w-full"/>
                    </div>
                    <div class="whitespace-pre select-text overflow-auto" bind:this={plainLyricsContainer}>{track.plainLyrics}</div>
                </Card.Content>
                <Card.Footer>
                </Card.Footer>
            </Card.Root>
        </Tabs.Content>
    </Tabs.Root>
</div>
