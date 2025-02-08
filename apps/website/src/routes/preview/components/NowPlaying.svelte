<script lang="ts">
    import type { FastAverageColorResult } from 'fast-average-color';
    import type { IAudioMetadata } from '$lib/helpers/types';
    import { AspectRatio } from '$lib/components/ui/aspect-ratio';
    import AppearanceSettings from '../../../lib/components/shared/AppearanceSettings.svelte';
    import * as DropdownMenu from '../../../lib/components/ui/dropdown-menu';
    import { ExternalLink, Home } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { cn } from '../../../lib/helpers/utils';

    let {
        averageColor = $bindable(),
        metadata = $bindable(),
        ...props
    }: {
        averageColor: FastAverageColorResult|null;
        metadata: IAudioMetadata;
        [key: string]: any;
    } = $props();
</script>

<div class="h-20 shrink-0 w-full overflow-hidden">
    <div class="flex items-center gap-4">
        <div class="w-16 shrink-0">
            <AspectRatio ratio={1/1}  class="w-full relative overflow-hidden rounded-lg shadow-lg">
                <img src={metadata.cover} alt={metadata.title} class="object-cover h-full w-full">
            </AspectRatio>
        </div>
        <div class={cn("text-left flex flex-col text-nowrap w-[calc(100%-8.8rem)] *:text-ellipsis *:overflow-hidden")}>
            <h1 class="text-xl font-semibold leading-tight tracking-wide">{metadata.title}</h1>
            <h4 class="text-sm opacity-65 leading-tight tracking-wide">{metadata.artist}</h4>
        </div>
        <div class="shrink-0">
            <AppearanceSettings class="bg-white/10 hover:bg-white/20 rounded-full border-none">
                <DropdownMenu.Separator />
                <DropdownMenu.Item onclick={() => goto(base)}>
                    <Home size=16 class="mr-2"/>
                    Homepage
                </DropdownMenu.Item>
            </AppearanceSettings>
        </div>
    </div>
</div>