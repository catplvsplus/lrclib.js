<script lang="ts">
    import type { Track } from 'lrclib';
    import * as Tabs from "../ui/tabs";
    import { ScrollArea } from '../ui/scroll-area';
    import { cn } from '../../helpers/utils';

    let { track = $bindable(), ...props }: { track: Track; [key: string]: any; } = $props();
</script>

{#snippet TextViewer(content: string)}
    {@const lines = content.split('\n')}
    <div class="h-full w-full">
        <ScrollArea class="h-full p-3 rounded-lg bg-muted text-lg" orientation="both">
            {#each lines as line, index}
                <p id="{track.id}-{index}">
                    {line}
                </p>
            {/each}
        </ScrollArea>
    </div>
{/snippet}

<Tabs.Root value="plain" {...props} class={cn("w-full h-full flex flex-col", props.class)}>
    <Tabs.List class="overflow-auto max-w-full justify-normal w-fit">
        <Tabs.Trigger value="plain">Synced</Tabs.Trigger>
        <Tabs.Trigger value="synced">Unsynced</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content class="h-[calc(100%-3rem)]" value="plain">{@render TextViewer(track.plainLyrics)}</Tabs.Content>
    <Tabs.Content class="h-[calc(100%-3rem)]" value="synced">{@render TextViewer(track.syncedLyrics)}</Tabs.Content>
</Tabs.Root>