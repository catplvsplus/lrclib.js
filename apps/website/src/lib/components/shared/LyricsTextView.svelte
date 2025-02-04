<script lang="ts">
    import type { Track, TrackSyncedLyrics } from 'lrclib';
    import * as Tabs from "../ui/tabs";
    import { ScrollArea } from '../ui/scroll-area';
    import { cn } from '../../helpers/utils';

    let { track = $bindable(), ...props }: { track: Track; [key: string]: any; } = $props();
</script>

{#snippet TextViewer(content: string|TrackSyncedLyrics)}
    <div class="h-full w-full">
        <ScrollArea class="h-full p-3 rounded-lg bg-muted text-lg" orientation="both">
            {#if typeof content === 'string'}
                {@const lines = content.split('\n')}
                {#each lines as line, index}
                    <p id="{track.id}-{index}">
                        {line}
                    </p>
                {/each}
            {:else}
                {#each content as line, index}
                    <p id="{track.id}-{index}">
                        <span class="text-primary/90 font-semibold font-mono">{line.rawTime}</span>
                        {line.text}
                    </p>
                {/each}
            {/if}
        </ScrollArea>
    </div>
{/snippet}

<Tabs.Root value={track.isSynced() ? 'synced' : 'plain'} {...props} class={cn("w-full h-full flex flex-col", props.class)}>
    <Tabs.List class="overflow-auto max-w-full justify-normal sm:w-fit">
        <Tabs.Trigger value="plain" class="max-sm:w-1/2">Unsynced</Tabs.Trigger>
        <Tabs.Trigger value="synced" class="max-sm:w-1/2" disabled={!track.isSynced()}>Synced</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content class="h-[calc(100%-3rem)]" value="plain">{@render TextViewer(track.plainLyrics)}</Tabs.Content>
    <Tabs.Content class="h-[calc(100%-3rem)]" value="synced">{@render TextViewer(track.syncedLyricsJSON ?? [])}</Tabs.Content>
</Tabs.Root>