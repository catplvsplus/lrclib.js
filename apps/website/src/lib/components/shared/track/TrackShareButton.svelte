<script lang="ts">
    import { Button, type ButtonProps } from "@/components/ui/button";
    import { Share2Icon } from '@lucide/svelte';
    import type { APIResponse } from 'lrclib.js';
    import { resolve } from '$app/paths';
    import { cn } from '$lib/helpers/utils';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
    import ResponsiveDialog from '../ResponsiveDialog.svelte';
    import { DialogState } from '$lib/helpers/classes/DialogState.svelte';

    let {
        track,
        ...buttonProps
    }: {
        track: APIResponse.Get.TrackSignature;
    } & ButtonProps = $props();

    let dialogState = new DialogState({
        id: `track-share-${track.id}`,
        mode: 'push'
    });

    let shareData: ShareData = $derived({
        title: `Lrclib.js | ${track.trackName}`,
        text: `${track.trackName} by ${track.artistName}`,
        url: `${window.location.origin}${resolve('/(main)/track/[id]', { id: String(track.id) })}`,
    });

    async function share() {
        if ('canShare' in navigator && 'share' in navigator && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
        }

        dialogState.open();
    }
</script>

<Tooltip>
    <TooltipTrigger>
        {#snippet child({ props })}
            <Button
                variant="secondary"
                size="icon"
                {...props}
                {...buttonProps}
                onclick={share}
                class={cn("text-sm font-bold text-muted-foreground bg-muted/90", buttonProps.class)}
            >
                <Share2Icon/>
            </Button>
        {/snippet}
    </TooltipTrigger>
    <TooltipContent>
        Share
    </TooltipContent>
</Tooltip>

<ResponsiveDialog {dialogState}>
    {#snippet title()}Share to{/snippet}
    {#snippet description()}Choose a platform to share this track with or copy the link to clipboard{/snippet}
    {#snippet footer()}
        <Button onclick={dialogState.close}>Close</Button>
    {/snippet}
</ResponsiveDialog>