<script lang="ts">
    import { Button, type ButtonProps } from "@/components/ui/button";
    import { LoaderIcon, PlayIcon } from '@lucide/svelte';
    import type { APIResponse } from 'lrclib.js';
    import type { ClassValue } from 'svelte/elements';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
    import { PlayerTrack } from '../../../helpers/classes/PlayerTrack.svelte';
    import { player } from '../../../helpers/classes/Player.svelte';
    import { cn } from '../../../helpers/utils';
    import FlyInOut from '../FlyInOut.svelte';
    import { toast } from 'svelte-sonner';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    let {
        track,
        labelClass,
        ...buttonProps
    }: {
        track: APIResponse.Get.TrackSignature;
        labelClass?: ClassValue;
    } & ButtonProps = $props();

    let fileInput: HTMLInputElement|null = $state(null);
    let pending: boolean = $state(false);

    async function handleFileChange() {
        const file = fileInput?.files?.item(0);
        if (!file) return;

        pending = true;

        const item = new PlayerTrack({
            audio: file,
            lyrics: track
        });

        await item.fetchMetadata().catch(console.error);
        await player.play(item).catch(console.error);

        pending = false;
        toast.success(`Added ${item.title} to queue`, {
            action: {
                label: 'View',
                onClick: () => goto(resolve('/(main)/player'))
            }
        });
    }
</script>

<Tooltip>
    <TooltipTrigger>
        {#snippet child({ props })}
            <Button
                {...props}
                {...buttonProps}
                variant="secondary"
                class={cn(
                    "relative overflow-hidden",
                    buttonProps.class
                )}
                onclick={() => fileInput?.click()}
            >
                {#if pending}
                    <FlyInOut class="flex gap-1 items-center">
                        <LoaderIcon class="animate-spin"/>
                        <span class={labelClass}>Parsing</span>
                    </FlyInOut>
                {:else}
                    <FlyInOut class="flex gap-1 items-center">
                        <PlayIcon/>
                        <span class={labelClass}>Preview</span>
                    </FlyInOut>
                {/if}
                <div class="flex gap-1 opacity-0">
                    <PlayIcon/>
                    <span class={labelClass}>{pending ? 'Parsing' : 'Preview'}</span>
                </div>
            </Button>
        {/snippet}
    </TooltipTrigger>
    <TooltipContent>Play audio with lyrics preview</TooltipContent>
</Tooltip>
<input type="file" accept="audio/*" class="hidden" bind:this={fileInput} onchange={handleFileChange} />