<script lang="ts">
    import ResponsiveDialog from '../ResponsiveDialog.svelte';
    import { DialogState } from '$lib/helpers/classes/DialogState.svelte';
    import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Slider } from '@/components/ui/slider';
    import { Button, type ButtonProps } from '@/components/ui/button';
    import { LetterTextIcon, Music2Icon } from '@lucide/svelte';
    import { slide } from 'svelte/transition';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import type { PlayerTrack } from '$lib/helpers/classes/PlayerTrack.svelte';

    let {
        delay = $bindable(),
        track
    }: {
        delay: number;
        track: PlayerTrack;
    } = $props();
</script>

<script module>
    export const lyricsSettingsDialogState = new DialogState({
        id: 'lyrics-settings',
    });
</script>
<ResponsiveDialog dialogState={lyricsSettingsDialogState}>
    {#snippet title()}Lyrics settings{/snippet}
    {#snippet description()}Change lyrics type and delay{/snippet}
    {#snippet content({ type })}
        <div class="grid" class:px-4={type === 'drawer'}>
            <Tabs value={track.lyricsType} onValueChange={v => track.lyricsType = v as PlayerTrack.LyricsType} class="w-full">
                <TabsList class="w-full h-fit">
                    <TabsTrigger value={'synced'} disabled={!track.syncedLyrics} class="p-2 font-semibold data-[state=active]:text-primary">
                        <Music2Icon/>
                        Synced
                    </TabsTrigger>
                    <TabsTrigger value={'plain'} disabled={!track.plainLyrics} class="p-2 font-semibold data-[state=active]:text-primary">
                        <LetterTextIcon/>
                        Plain
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            {#if track.lyricsType === 'synced'}
                <div class="grid pt-2" transition:slide={{ duration: settings.prefersReducedMotion ? 0 : 300 }}>
                    <h3 class="text-sm font-bold">Lyrics Delay</h3>
                    <p class="text-xs text-muted-foreground mb-2">Adjust the delay of the lyrics when synced lyrics are displayed</p>
                    <Slider bind:value={delay} type="single" min={-5} max={5} step={0.5} class="w-full"/>
                    <p class="text-center text-xs text-muted-foreground font-medium mt-2">
                        {delay ? `${delay} second${delay != 1 && delay != -1 ? 's' : ''}` : 'No delay'}
                    </p>
                </div>
            {/if}
        </div>
    {/snippet}
    {#snippet footer()}
        <Button variant="secondary" onclick={lyricsSettingsDialogState.close}>Close</Button>
    {/snippet}
</ResponsiveDialog>