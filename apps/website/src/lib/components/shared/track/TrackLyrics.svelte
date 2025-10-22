<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { Tabs, TabsContent, TabsTrigger } from '../../ui/tabs';
    import TabsList from '../../ui/tabs/tabs-list.svelte';
    import { PersistedState } from 'runed';
    import { Textarea } from '../../ui/textarea';
    import { Button } from '../../ui/button';
    import { Check, Clipboard, DrumIcon } from '@lucide/svelte';
    import { copyText } from '../../../helpers/clipboard';
    import { toast } from 'svelte-sonner';
    import FlyInOut from '../FlyInOut.svelte';
    import { cn } from '../../../helpers/utils';
    import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../ui/empty';

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

    let copied = $state(false);
    let valueContainer: HTMLElement|null = $state(null);
    let activeValue: string|null = $derived(preferredTab.current === 'synced-lyrics' ? track.syncedLyrics : track.plainLyrics);

    function copyToClipboard(e: MouseEvent) {
        e.preventDefault();
        if (copied || !activeValue) return;

        copied = copyText({
            text: activeValue,
            container: valueContainer ?? undefined,
            selectRequired: true
        });

        if (copied) {
            toast.success('Copied to clipboard!');
            setTimeout(() => copied = false, 5000);
        } else {
            toast.error('Failed to copy to clipboard');
        }
    }
</script>

<Tabs bind:value={preferredTab.current} class="bg-card rounded-lg border-card shadow min-h-96">
    <div class="flex gap-2 mb-0 p-2 pb-2 items-center border-b">
        <TabsList class="w-full h-10 bg-muted/90 p-0">
            <TabsTrigger value="synced-lyrics" class="text-sm font-semibold text-foreground! rounded-lg border-0 shadow-none! data-[state=active]:text-primary! bg-transparent! hover:bg-black/5! dark:hover:bg-secondary/80! data-[state=active]:[&_span]:w-8! data-[state=active]:[&_span]:opacity-100! relative" disabled={!track.syncedLyrics}>
                Synced
                <span class="absolute block h-0.5 w-0 rounded-full bg-current bottom-0 opacity-0 left-1/2 -translate-x-1/2 transition-all duration-200"></span>
            </TabsTrigger>
            <TabsTrigger value="plain-lyrics" class="text-sm font-semibold text-foreground! rounded-lg border-0 shadow-none! data-[state=active]:text-primary! bg-transparent! hover:bg-black/5! dark:hover:bg-secondary/80! data-[state=active]:[&_span]:w-8! data-[state=active]:[&_span]:opacity-100! relative" disabled={!track.plainLyrics}>
                Plain
                <span class="absolute block h-0.5 w-0 rounded-full bg-current bottom-0 opacity-0 left-1/2 -translate-x-1/2 transition-all duration-200"></span>
            </TabsTrigger>
        </TabsList>
        <Button
            variant="secondary"
            class={cn(
                "h-10 px-4! text-sm font-semibold rounded-lg bg-muted/90 hover:bg-black/5 dark:hover:bg-secondary/80 text-foreground relative overflow-clip",
                copied && "bg-primary/5! text-primary"
            )}
            disabled={track.instrumental}
            onclick={copyToClipboard}
        >
            {#if copied}
                <FlyInOut class="flex gap-1" inY={30} outY={-30}>
                    <Check class="size-4.5!"/>
                    <span>Copied</span>
                </FlyInOut>
            {:else}
                <FlyInOut class="flex gap-1" inY={30} outY={-30}>
                    <Clipboard class="size-4.5!"/>
                    <span>Copy</span>
                </FlyInOut>
            {/if}
            <div class="flex gap-1 opacity-0">
                <Clipboard class="size-4.5!"/>
                <span>{copied ? 'Copied' : 'Copy'}</span>
            </div>
        </Button>
    </div>
    {#if !track.instrumental}
        <TabsContent value="synced-lyrics">
            <Textarea
                value={track.syncedLyrics}
                bind:ref={
                    () => preferredTab.current === 'synced-lyrics' ? valueContainer : null,
                    ref => preferredTab.current === 'synced-lyrics' ? valueContainer = ref : null
                }
                readonly
                class="text-base min-h-full font-mono p-5 pt-2 rounded-t-none resize-none shadow-none border-0 bg-transparent!"
            />
        </TabsContent>
        <TabsContent value="plain-lyrics">
            <Textarea
                value={track.plainLyrics}
                bind:ref={
                    () => preferredTab.current === 'plain-lyrics' ? valueContainer : null,
                    ref => preferredTab.current === 'plain-lyrics' ? valueContainer = ref : null
                }
                readonly
                class="text-base min-h-full font-mono p-5 pt-2 rounded-t-none resize-none shadow-none border-0 bg-transparent!"
            />
        </TabsContent>
    {:else}
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <DrumIcon/>
                </EmptyMedia>
                <EmptyTitle class="font-bold">Lyrics unavailable</EmptyTitle>
                <EmptyDescription>This track is an instrumental</EmptyDescription>
            </EmptyHeader>
        </Empty>
    {/if}
</Tabs>