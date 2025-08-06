<script lang="ts">
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "@/components/ui/form";
    import type { SuperForm } from 'sveltekit-superforms';
    import type { PublishTrackSchema } from '$lib/helpers/schema';
    import { Textarea } from '@/components/ui/textarea';
    import { Button } from '@/components/ui/button';
    import { ArrowLeftRightIcon } from '@lucide/svelte';
    import { LRC } from 'lrclib.js';
    import { TextareaAutosize } from 'runed';

    let {
        form
    }: {
        form: SuperForm<Partial<PublishTrackSchema>>;
    } = $props();

    const { form: formData, submitting } = form;

    let canImportFromSynced = $derived(!!$formData.syncedLyrics?.trim() && !$formData.plainLyrics?.trim() && LRC.isValidLRC($formData.syncedLyrics));
    let syncedTextarea: HTMLTextAreaElement|null = $state(null);
    let plainTextarea: HTMLTextAreaElement|null = $state(null);

    function syncedToPlain() {
        $formData.plainLyrics = LRC.toPlain(LRC.parse($formData.syncedLyrics ?? '')).trim();
    }

    const syncedSize = new TextareaAutosize({
        element: () => syncedTextarea!,
        input: () => $formData.syncedLyrics ?? ''
    });

    const plainSize = new TextareaAutosize({
        element: () => plainTextarea!,
        input: () => $formData.plainLyrics ?? ''
    });

    let largestSize = $derived(Math.max(syncedSize.textareaHeight, plainSize.textareaHeight));
</script>
<div class="flex md:flex-row flex-col gap-5">
    <FormField {form} name="syncedLyrics" class="md:w-1/2">
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>Synced Lyrics</FormLabel>
                <Textarea
                    {...props}
                    bind:ref={syncedTextarea}
                    bind:value={$formData.syncedLyrics}
                    disabled={$submitting}
                    placeholder="[00:00.000] Some lyrics"
                    class="min-h-80 max-w-full field-sizing-fixed font-mono"
                />
            {/snippet}
        </FormControl>
        <FormFieldErrors/>
    </FormField>
    <FormField {form} name="plainLyrics" class="md:w-1/2">
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>Plain Lyrics</FormLabel>
                <Textarea
                    {...props}
                    bind:ref={plainTextarea}
                    bind:value={$formData.plainLyrics}
                    disabled={$submitting}
                    placeholder="Some lyrics"
                    class="min-h-80 max-w-full field-sizing-fixed font-mono"
                />
            {/snippet}
        </FormControl>
        <div class="flex gap-2 sm:justify-between sm:items-center sm:flex-row flex-col">
            <FormFieldErrors/>
            <Button type="button" size="sm" variant="outline" disabled={$submitting || !canImportFromSynced} onclick={syncedToPlain} class="disabled:hidden! text-sm text-foreground animate-in duration-300 fade-in">
                <ArrowLeftRightIcon/>
                Convert synced to plain
            </Button>
        </div>
    </FormField>
</div>