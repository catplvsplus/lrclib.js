<script lang="ts">
    import TrackCard from '$lib/components/app/TrackCard.svelte';
    import { FileMusicIcon, Music4Icon, TextAlignCenterIcon, TimelineIcon } from '@lucide/svelte';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
    import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$lib/components/ui/empty/index.js';
    import { formatLRCDuration } from '$lib/helpers/metadata.js';
    import { resource } from 'runed';
    import { codeToHtml } from 'shiki';
    import CopyButton from '$lib/components/app/CopyButton.svelte';

    let { data } = $props();

    let track = $derived(data.track);
    let lyricsfile = $derived(track.getLyricsfile());

    let activeTab = $derived(track.isSynced() ? "synced" : track.isPlain() ? "plain" : "instrumental");
    let value = $derived.by(() => {
        switch (activeTab) {
            case "synced":
                return track.syncedLyrics || lyricsfile.lines?.map(line => `[${formatLRCDuration(line.start_ms)}] ${line.text}`).join('\n');
            case "plain":
                return lyricsfile.plain || lyricsfile.lines?.map(line => line.text).join('\n');
            case "lyricsfile":
                return lyricsfile.toString();
        }
    });

    const lyricsfileContent = resource(
        () => lyricsfile,
        async (lyricsfile) => codeToHtml(lyricsfile.toString(), {
            lang: 'yaml',
            themes: {
                light: 'one-light',
                dark: 'one-dark-pro'
            },
            defaultColor: false
        })
    );
</script>

<div class="flex flex-col gap-2 sm:pl-0 px-4 pb-4">
    <TrackCard {track} class="h-fit"/>
    <Tabs
        bind:value={activeTab}
        class="size-full"
    >
        <TabsList variant="line">
            <TabsTrigger value="synced" disabled={!track.isSynced()}>
                <TimelineIcon/>
                Synced
            </TabsTrigger>
            <TabsTrigger value="plain" disabled={track.isInstrumental()}>
                <TextAlignCenterIcon/>
                Plain
            </TabsTrigger>
            <TabsTrigger value="lyricsfile">
                <FileMusicIcon/>
                Lyricsfile
            </TabsTrigger>
        </TabsList>
        <div class="relative">
            <TabsContent value="synced" class="border p-2 rounded-xl bg-muted/20 w-full h-fit overflow-auto whitespace-nowrap font-mono">
                {#each lyricsfile.lines as line}
                    <p>
                        <span class="text-muted-foreground/80">[{formatLRCDuration(line.start_ms)}]</span>
                        {line.text}
                    </p>
                {/each}
            </TabsContent>
            <TabsContent value="plain" class="border p-2 rounded-xl bg-muted/20 w-full h-fit overflow-auto whitespace-nowrap font-mono">
                {#if lyricsfile.plain}
                    {#each lyricsfile.plain.split('\n') as line}
                        {#if line.trim() === ''}
                            <br/>
                        {:else}
                            <p>{line}</p>
                        {/if}
                    {/each}
                {:else}
                    {#each lyricsfile.lines as line}
                        <p>{line.text}</p>
                    {/each}
                {/if}
            </TabsContent>
            <TabsContent value="lyricsfile" class="border p-2 rounded-xl bg-muted/20 w-full h-fit overflow-auto">
                {@html lyricsfileContent.current}
            </TabsContent>
            <TabsContent value="instrumental" class="flex justify-center items-center">
                <Empty>
                    <EmptyHeader class="gap-1">
                        <EmptyMedia variant="icon">
                            <Music4Icon/>
                        </EmptyMedia>
                        <EmptyTitle class="text-lg">
                            Instrumental Track
                        </EmptyTitle>
                        <EmptyDescription class="text-xs">
                            This track is instrumental and does not contain any lyrics.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </TabsContent>
            <CopyButton
                class="absolute top-2 right-2"
                text={value ?? ''}
            />
        </div>
    </Tabs>
</div>