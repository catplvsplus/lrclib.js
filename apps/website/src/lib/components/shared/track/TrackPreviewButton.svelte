<script lang="ts">
    import { Button, type ButtonProps } from "@/components/ui/button";
    import { PlayIcon } from '@lucide/svelte';
    import type { APIResponse } from 'lrclib.js';
    import type { ClassValue } from 'svelte/elements';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

    let {
        track,
        labelClass,
        ...buttonProps
    }: {
        track: APIResponse.Get.TrackSignature;
        labelClass?: ClassValue;
    } & ButtonProps = $props();
</script>

<Tooltip>
    <TooltipTrigger>
        {#snippet child({ props })}
            <Button
                {...props}
                {...buttonProps}
                variant="secondary"
                class={buttonProps.class}
            >
                <PlayIcon/>
                <span class={labelClass}>Preview</span>
            </Button>
        {/snippet}
    </TooltipTrigger>
    <TooltipContent>Play audio with lyrics preview</TooltipContent>
</Tooltip>