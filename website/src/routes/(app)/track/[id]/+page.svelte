<script lang="ts">
    import TrackCard from '#lib/components/app/TrackCard.svelte';
    import { DownloadIcon, FileMusicIcon, FileTextIcon, SixteenthNotesIcon, TextAlignCenterIcon, TimelineIcon } from '@lucide/svelte';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '#lib/components/ui/tabs/index.js';
    import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '#lib/components/ui/empty/index.js';
    import { formatLRCDuration } from '#lib/helpers/metadata.js';
    import { slug } from 'github-slugger';
    import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle } from '#lib/components/ui/code-block/index.js';
    import { Button } from '#lib/components/ui/button/index.js';
    import { useHighlightedCode } from '../../../../lib/hooks/use-highlighted-code.svelte.js';

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

    const fileName = $derived.by(() => {
        let fileType = '.txt';

        switch (activeTab) {
            case "synced":
                fileType = '.lrc';
                break;
            case "plain":
                fileType = '.txt';
                break;
            case "lyricsfile":
                fileType = '.lyricsfile.yaml';
                break;
        }

        return `${slug(track.trackName)}${fileType}`;
    });

    const content = useHighlightedCode(
        () => value ?? '',
        () => activeTab === 'lyricsfile' ? 'yaml' : 'plaintext'
    )

    function downloadLyrics() {
        const blob = new Blob([value ?? ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);
    }
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
        {#if !track.isInstrumental() || activeTab === 'lyricsfile'}
            <TabsContent value={activeTab}>
                <CodeBlock class="rounded-xl">
                    <CodeBlockHeader>
                        <CodeBlockTitle>
                            <FileTextIcon/>
                            {fileName}
                        </CodeBlockTitle>
                        <CodeBlockActions>
                            <CodeBlockCopyButton
                                variant="outline"
                                size="icon"
                                value={value ?? ''}
                            />
                            <Button
                                variant="outline"
                                onclick={() => downloadLyrics()}
                            >
                                <DownloadIcon/>
                                <span>Download</span>
                            </Button>
                        </CodeBlockActions>
                    </CodeBlockHeader>
                    <CodeBlockContent
                        lang={activeTab === 'lyricsfile' ? 'yml' : 'txt'}
                        lineNumbers={activeTab === 'lyricsfile'}
                    >
                        {#each content.current as line, index (index)}
                            <CodeBlockLine code={line}/>
                        {/each}
                    </CodeBlockContent>
                </CodeBlock>
            </TabsContent>
        {/if}
        <TabsContent value="instrumental" class="flex justify-center items-center size-full min-h-125">
            <Empty>
                <EmptyHeader class="gap-1">
                    <EmptyMedia variant="icon">
                        <SixteenthNotesIcon/>
                    </EmptyMedia>
                    <EmptyTitle class="text-lg">
                        Instrumental Track
                    </EmptyTitle>
                    <EmptyDescription class="text-xs">
                        This track is instrumental and does not contain any lyrics.
                    </EmptyDescription>
                    <div class="flex justify-center mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={() => activeTab = 'lyricsfile'}
                        >
                            View Lyricsfile
                        </Button>
                    </div>
                </EmptyHeader>
            </Empty>
        </TabsContent>
    </Tabs>
</div>