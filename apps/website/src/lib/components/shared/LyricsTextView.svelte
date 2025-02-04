<script lang="ts">
    import type { Track, TrackSyncedLyrics } from 'lrclib';
    import * as Tabs from "../ui/tabs";
    import { ScrollArea } from '../ui/scroll-area';
    import { cn, selectText } from '../../helpers/utils';
    import { lastActiveTab } from '../../helpers/stores';
    import { Button } from '../ui/button';
    import { Clipboard, Download, Play } from 'lucide-svelte';
    import { Separator } from 'bits-ui';
    import { toast } from 'svelte-sonner';

    let { track = $bindable(), ...props }: { track: Track; [key: string]: any; } = $props();

    let plainContainer: HTMLDivElement;
    let syncedContainer: HTMLDivElement;
    let activeTab: 'plain' | 'synced' = $state($lastActiveTab ?? (track.isSynced() ? 'synced' : 'plain'));

    function downloadLyrics() {
        const text = activeTab === 'plain' ? track.plainLyrics : track.syncedLyrics;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;
        a.download = `${track.trackName}.lrc`;

        toast.success(`Lyrics downloaded!`);

        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        a.remove();
    }

    function copyLyrics() {
        const text = activeTab === 'plain' ? track.plainLyrics : track.syncedLyrics;
        const container = activeTab === 'plain' ? plainContainer : syncedContainer;

        if (!selectText(container)) return;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            document.execCommand('copy');
        }

        toast.success('Lyrics copied to clipboard!');
    }

    function playLyrics() {

    }

    $effect(() => {
        $lastActiveTab = activeTab;
    });
</script>

{#snippet TextViewer(content: string|TrackSyncedLyrics)}
    <div class="h-full w-full">
        <ScrollArea class="h-full p-3 rounded-lg bg-muted leading-{typeof content === 'string' ? 'normal' : 'relaxed'}" orientation="both">
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
                        <span class="text-primary/90 font-extrabold font-mono">{line.rawTime}</span>
                        {line.text}
                    </p>
                {/each}
            {/if}
        </ScrollArea>
    </div>
{/snippet}

<Tabs.Root bind:value={activeTab} {...props} class={cn("w-full h-full flex flex-col", props.class)}>
    <div class="flex gap-2 w-full">
        <Tabs.List class="overflow-auto w-full justify-normal sm:w-fit">
            <Tabs.Trigger value="plain" class="max-sm:w-1/2">Unsynced</Tabs.Trigger>
            <Tabs.Trigger value="synced" class="max-sm:w-1/2" disabled={!track.isSynced()}>Synced</Tabs.Trigger>
        </Tabs.List>
        <div class="h-10 rounded-lg bg-muted shrink-0 flex overflow-hidden *:rounded-none">
            <Button variant="ghost" size="icon" title="Download" onclick={downloadLyrics}>
                <Download/>
            </Button>
            <Separator.Root orientation="vertical" class="bg-foreground/5 w-px"/>
            <Button variant="ghost" size="icon" title="Copy" onclick={copyLyrics}>
                <Clipboard/>
            </Button>
            <Separator.Root orientation="vertical" class="bg-foreground/5 w-px"/>
            <Button variant="ghost" title="Preview" class="font-semibold sm:w-fit sm:p-4" size="icon" onclick={playLyrics}>
                <Play/><span class="sm:inline hidden">Preview</span>
            </Button>
        </div>
    </div>
    <Tabs.Content class="h-[calc(100%-3rem)]" value="plain">
        <div bind:this={plainContainer} class="h-full">
            {@render TextViewer(track.plainLyrics)}
        </div>
    </Tabs.Content>
    <Tabs.Content class="h-[calc(100%-3rem)]" value="synced">
        <div bind:this={syncedContainer} class="h-full">
            {@render TextViewer(track.syncedLyricsJSON ?? [])}
        </div>
    </Tabs.Content>
</Tabs.Root>