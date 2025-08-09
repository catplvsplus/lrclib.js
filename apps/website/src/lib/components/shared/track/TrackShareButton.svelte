<script lang="ts">
    import { Button, type ButtonProps } from "@/components/ui/button";
    import { CheckIcon, ClipboardIcon, Share2Icon } from '@lucide/svelte';
    import type { APIResponse } from 'lrclib.js';
    import { resolve } from '$app/paths';
    import { cn } from '$lib/helpers/utils';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
    import ResponsiveDialog from '../ResponsiveDialog.svelte';
    import { DialogState } from '$lib/helpers/classes/DialogState.svelte';
    import { Input } from '../../ui/input';
    import { copyText } from '../../../helpers/clipboard';
    import { toast } from 'svelte-sonner';
    import FlyInOut from '../FlyInOut.svelte';
    import { SiBluesky, SiFacebook, SiReddit, SiTelegram, SiWhatsapp, SiX } from '@icons-pack/svelte-simple-icons';

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

    let copied = $state(false);
    let valueContainer: HTMLElement|null = $state(null);

    async function share() {
        if ('canShare' in navigator && 'share' in navigator && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
        }

        dialogState.open();
    }

    function copyToClipboard(e: MouseEvent) {
        e.preventDefault();
        if (copied) return;

        copied = copyText({
            text: shareData.url,
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
    {#snippet content({ type })}
        <div class:px-4={type === 'drawer'} class=" py-2 grid gap-2">
            <div class="flex items-center gap-2 min-[400px]:justify-start justify-between">
                <Button size="icon" class="bg-blue-500!" href="https://www.facebook.com/sharer/sharer.php?u={shareData.url}" target="_blank">
                    <SiFacebook/>
                </Button>
                <Button size="icon" class="bg-black!" href="https://twitter.com/intent/tweet?text={shareData.text}&url={shareData.url}" target="_blank">
                    <SiX/>
                </Button>
                <Button size="icon" class="bg-blue-400!" href="https://bsky.app/intent/compose?text={shareData.text}&url={shareData.url}" target="_blank">
                    <SiBluesky/>
                </Button>
                <Button size="icon" class="bg-[#0088cc]!" href="https://t.me/share/url?text={shareData.text}&url={shareData.url}" target="_blank">
                    <SiTelegram/>
                </Button>
                <Button size="icon" class="bg-green-500!" href="https://wa.me/?text={shareData.text}+{shareData.url}" target="_blank">
                    <SiWhatsapp/>
                </Button>
                <Button size="icon" class="bg-[#ff4500]!" href="https://www.reddit.com/submit?url={shareData.url}&title={shareData.title}" target="_blank">
                    <SiReddit/>
                </Button>
            </div>
            <div class="relative">
                <Input bind:ref={valueContainer} value={shareData.url} readonly class="select-all pr-9 text-sm"/>
                <Tooltip>
                    <TooltipTrigger>
                        {#snippet child({ props })}
                            <Button {...props} size="icon" class="absolute overflow-clip top-0 right-0 rounded-l-none text-primary! bg-transparent! cursor-pointer" onclick={copyToClipboard}>
                                {#if copied}
                                    <FlyInOut>
                                        <CheckIcon class="size-4"/>
                                    </FlyInOut>
                                {:else}
                                    <FlyInOut>
                                        <ClipboardIcon class="size-4"/>
                                    </FlyInOut>
                                {/if}
                            </Button>
                        {/snippet}
                    </TooltipTrigger>
                    <TooltipContent>{copied ? 'Copied' : 'Copy to clipboard'}</TooltipContent>
                </Tooltip>
            </div>
        </div>
    {/snippet}
    {#snippet footer()}
        <Button variant="secondary" class="font-semibold" onclick={dialogState.close}>Close</Button>
    {/snippet}
</ResponsiveDialog>