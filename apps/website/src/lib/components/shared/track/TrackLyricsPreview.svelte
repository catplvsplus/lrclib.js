<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { Tabs, TabsContent, TabsTrigger } from '../../ui/tabs';
    import TabsList from '../../ui/tabs/tabs-list.svelte';
    import { ScrollArea } from '../../ui/scroll-area';
    import { PersistedState } from 'runed';
    import { Textarea } from '../../ui/textarea';

    let {
        track
    }: {
        track: APIResponse.Get.TrackSignature;
    } = $props();

    let preferredTab = new PersistedState<'synced-lyrics'|'plain-lyrics'>('lrclib-track-preferred-tab', 'synced-lyrics');

    $effect(() => {
        if (!track.syncedLyrics && !track.plainLyrics) return;

        if (preferredTab.current === 'synced-lyrics' && !track.syncedLyrics) {
            preferredTab.current = 'plain-lyrics';
        } else if (preferredTab.current === 'plain-lyrics' && !track.plainLyrics) {
            preferredTab.current = 'synced-lyrics';
        }
    });
</script>

<Tabs bind:value={preferredTab.current}>
    <TabsList class="w-full font-semibold text-sm h-10">
        <TabsTrigger value="synced-lyrics" disabled={!track.syncedLyrics}>
            Synced Lyrics
        </TabsTrigger>
        <TabsTrigger value="plain-lyrics" disabled={!track.plainLyrics}>
            Plain Lyrics
        </TabsTrigger>
    </TabsList>
    <TabsContent value="synced-lyrics">
        <Textarea value={track.syncedLyrics} readonly class="text-base font-mono p-5 rounded-lg resize-none"/>
    </TabsContent>
    <TabsContent value="plain-lyrics">
        <Textarea value={track.plainLyrics} readonly class="text-base font-mono p-5 rounded-lg resize-none"/>
    </TabsContent>
</Tabs>