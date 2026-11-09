<script lang="ts">
    import type { SuperForm } from 'sveltekit-superforms';
    import type { PublishSchema } from '../../schemas/publish';
    import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '../ui/input-group';
    import { FormControl, FormField } from '../ui/form';
    import FormFieldErrors from '../ui/form/form-field-errors.svelte';
    import FormLabel from '../ui/form/form-label.svelte';
    import { ArrowRightLeftIcon } from '@lucide/svelte';
    import { LRCParser } from '@braccato/parsers';

    let { form, disabled = false }: { form: SuperForm<PublishSchema>; disabled?: boolean; } = $props();

    const { form: formData, submitting } = form;

    let isModified = $state(false);
    let isConvertable = $derived(!!$formData.syncedLyrics.trim() && LRCParser.detect($formData.syncedLyrics) && !isModified);

    function convertSyncedToPlain() {
        if (!isConvertable) return;

        const parsed = LRCParser.parse($formData.syncedLyrics);
        const plain = parsed.map(l => l.words).join('\n');

        $formData.plainLyrics = plain;
        isModified = true;
    }
</script>

<div class="grid @3xl:grid-cols-2 gap-4">
    <FormField {form} name="syncedLyrics">
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>Synced Lyrics</FormLabel>
                <InputGroup>
                    <InputGroupTextarea
                        {...props}
                        {disabled}
                        bind:value={$formData.syncedLyrics}
                        name="syncedLyrics"
                        class="max-h-125"
                        placeholder="Enter synced lyrics here..."
                        onkeypress={() => isModified = false}
                    />
                </InputGroup>
            {/snippet}
        </FormControl>
        <FormFieldErrors/>
    </FormField>
    <FormField {form} name="plainLyrics">
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>Plain Lyrics</FormLabel>
                <InputGroup>
                    <InputGroupTextarea
                        {...props}
                        {disabled}
                        bind:value={$formData.plainLyrics}
                        name="plainLyrics"
                        class="max-h-125"
                        placeholder="Enter plain lyrics here..."
                        onkeypress={() => isModified = true}
                    />
                    {#if isConvertable && !disabled}
                        <InputGroupAddon align="block-end" class="border-t">
                            <InputGroupButton variant="default" onclick={convertSyncedToPlain} disabled={!isConvertable}>
                                <ArrowRightLeftIcon/>
                                From Synced Lyrics
                            </InputGroupButton>
                        </InputGroupAddon>
                    {/if}
                </InputGroup>
            {/snippet}
        </FormControl>
        <FormFieldErrors/>
    </FormField>
</div>