<script lang="ts">
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { FileInputIcon, LoaderIcon } from '@lucide/svelte';
    import { Input } from '@/components/ui/input';
    import type { APIResponse } from 'lrclib.js';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { WithElementRef } from '$lib/helpers/utils';
    import { parseAudioMetadata, parseLRCMetadata } from '$lib/helpers/metadata';
    import { fly } from 'svelte/transition';
    import { settings } from '$lib/helpers/classes/Settings.svelte';
    import FlyInOut from '../FlyInOut.svelte';

    let {
        isLoading = $bindable(false),
        ref = $bindable(null),
        disabled = false,
        setMetadata,
        title,
        description,
        ...props
    }: {
        isLoading?: boolean;
        disabled?: boolean;
        title?: string;
        description?: string;
        setMetadata: (metadata: Partial<Omit<APIResponse.Get.TrackSignature, 'id'|'instrumental'>>) => void
    } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

    async function importFromFile(event: Event & { currentTarget: HTMLInputElement }) {
        const files = event.currentTarget.files;
        if (!files?.length) return;

        const file = files[0];

        if (file) {
            let metadata: Partial<Omit<APIResponse.Get.TrackSignature, 'id'|'instrumental'>>;

            isLoading = true;

            switch (file.name.split('.').pop()) {
                case 'lrc':
                    metadata = await parseLRCMetadata(file);
                    break;
                default:
                    metadata = await parseAudioMetadata(file);
            }

            isLoading = false;
            setMetadata(metadata);
        }
    }

</script>

<Card bind:ref {...props}>
    <CardHeader>
        <CardTitle class="h-5 ">
            {#key isLoading}
                {@const sharedClass = "flex items-center gap-1"}
                {#if isLoading}
                    <FlyInOut class={sharedClass}>
                        <LoaderIcon class="animate-spin text-primary size-5"/>
                        Importing...
                    </FlyInOut>
                {:else}
                    <FlyInOut class={sharedClass}>
                        <FileInputIcon class="text-primary size-5"/>
                        {title ?? 'Import Metadata'}
                    </FlyInOut>
                {/if}
            {/key}
        </CardTitle>
        <CardDescription>
            {description ?? 'Import metadata from audio file or .lrc file'}
        </CardDescription>
    </CardHeader>
    <CardContent>
        <Input type="file" accept="audio/*,.lrc" onchange={importFromFile} disabled={isLoading || disabled}/>
    </CardContent>
</Card>