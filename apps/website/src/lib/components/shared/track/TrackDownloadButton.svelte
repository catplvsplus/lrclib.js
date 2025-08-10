<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import type { ButtonProps } from '@/components/ui/button';
    import type { ClassValue } from 'svelte/elements';
    import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
    import Button from '$lib/components/ui/button/button.svelte';
    import { ArrowDownToLineIcon, ListMusicIcon, TextIcon } from '@lucide/svelte';
    import { DialogState } from '$lib/helpers/classes/DialogState.svelte';
    import ResponsiveDialog from '../ResponsiveDialog.svelte';

    let {
        track,
        labelClass,
        ...buttonProps
    }: {
        track: APIResponse.Get.TrackSignature;
        labelClass?: ClassValue;
    } & ButtonProps = $props();

    let dialogState = new DialogState({
        id: `track-download-${track.id}`
    });

    function download(isSynced: boolean) {
        const text = isSynced ? track.syncedLyrics : track.plainLyrics;
        const blob = new Blob([text ?? ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `${track.trackName} - ${track.artistName}.${isSynced ? 'lrc' : 'txt'}`;

        a.click();
        URL.revokeObjectURL(url);
    }
</script>

<Tooltip>
    <TooltipTrigger>
        {#snippet child({ props })}
            <Button
                {...props}
                {...buttonProps}
                variant="secondary"
                onclick={dialogState.open}
                class={buttonProps.class}
            >
                <ArrowDownToLineIcon/>
                <span class={labelClass}>Download</span>
            </Button>
        {/snippet}
    </TooltipTrigger>
    <TooltipContent>Download lyrics to file</TooltipContent>
</Tooltip>

<ResponsiveDialog {dialogState}>
    {#snippet title()}Choose download format{/snippet}
    {#snippet description()}Select the format you want to download{/snippet}
    {#snippet content({ type })}
        <div class="grid gap-2 min-[400px]:grid-cols-2 py-2" class:px-4={type === 'drawer'}>
            <Button variant="outline" class="h-12 min-[400px]:justify-center justify-start" disabled={!track.syncedLyrics} onclick={() => download(true)}>
                <ListMusicIcon class="size-5"/>
                <span class="font-bold">Synced lyrics</span>
            </Button>
            <Button variant="outline" class="h-12 min-[400px]:justify-center justify-start" disabled={!track.plainLyrics} onclick={() => download(false)}>
                <TextIcon class="size-5"/>
                <span class="font-bold">Plain lyrics</span>
            </Button>
        </div>
    {/snippet}
    {#snippet footer()}
        <Button variant="secondary" class="font-semibold" onclick={dialogState.close}>Close</Button>
    {/snippet}
</ResponsiveDialog>