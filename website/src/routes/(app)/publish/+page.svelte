<script lang="ts">
    import { CircleCheckIcon, FileCheckCornerIcon, InfoIcon, LoaderCircleIcon, PlusIcon, SquarePenIcon, XIcon } from '@lucide/svelte';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#lib/components/ui/card/index.js';
    import ImportMetadata from '#lib/components/app/ImportMetadata.svelte';
    import { publishSchema } from '#lib/schemas/publish.js';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { superForm } from 'sveltekit-superforms';
    import { useDebounce } from 'runed';
    import { publishDraft, publisher } from '#lib/helpers/lyrics.js';
    import { Button, FormControl, FormField, FormFieldErrors, FormLabel } from '#lib/components/ui/form/index.js';
    import { Input } from '#lib/components/ui/input/index.js';
    import LyricsTextArea from '#lib/components/app/LyricsTextArea.svelte';
    import { snapshot } from '$app/navigation';
    import FlyInOut from '../../../lib/components/app/FlyInOut.svelte';

    let { data } = $props();

    const form = superForm(data.form, {
        validators: zod4Client(publishSchema),
        validationMethod: 'auto',
        dataType: 'json',
        taintedMessage: true,
        SPA: true,
        onChange: () => saveToDraft(),
        onError: error => {
            console.error(`Publish error:`, error.result.error);
        },
        onUpdate: async event => {
            await publisher.publish(event.form.data);
        }
    });

    const { form: formData, enhance, allErrors, submitting, tainted, capture, restore } = form;

    const saveToDraft = useDebounce(
        () => publishDraft.current = $formData,
        1000
    );

    let disabled = $derived(publisher.isPublishing || $submitting);

    snapshot({ capture, restore });
</script>

<div class="grid gap-4 sm:pl-0 px-4 pb-4">
    <ImportMetadata
        setMetadata={(metadata) => {
            $formData.trackName = metadata.trackName ?? $formData.trackName;
            $formData.artistName = metadata.artistName ?? $formData.artistName;
            $formData.albumName = metadata.albumName ?? $formData.albumName;
            $formData.duration = metadata.duration ?? $formData.duration;
            $formData.plainLyrics = metadata.plainLyrics ?? $formData.plainLyrics;
            $formData.syncedLyrics = metadata.syncedLyrics ?? $formData.syncedLyrics;
        }}
    />
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <InfoIcon class="size-5 text-primary"/>
                Important
            </CardTitle>
            <CardDescription>
                Please be mindful, your contributions help build a reliable and comprehensive database by ensuring the accuracy and quality of the lyrics you submit.
            </CardDescription>
        </CardHeader>
    </Card>
    <form use:enhance action="" method="post" class="grid gap-2 col-span-full">
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <SquarePenIcon class="size-5 text-primary"/>
                    Track Info
                </CardTitle>
                <CardDescription>
                    Enter the track information to be published.
                </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <FormField {form} name="trackName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Track Title</FormLabel>
                            <Input {...props} {disabled} bind:value={$formData.trackName} placeholder="Some song (ft. some artist)"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="artistName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Artist Name</FormLabel>
                            <Input {...props} {disabled} bind:value={$formData.artistName} placeholder="Some artist"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="albumName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Album Name</FormLabel>
                            <Input {...props} {disabled} bind:value={$formData.albumName} placeholder="Some album"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="duration">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Duration<span class="text-foreground/50">(in seconds)</span></FormLabel>
                            <Input {...props} {disabled} bind:value={$formData.duration} placeholder="120" type="number"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <LyricsTextArea {form} {disabled}/>
            </CardContent>
            <CardFooter class="flex justify-end gap-2">
                {#if publisher.isPublishing}
                    <Button type="button" variant="destructive" onclick={() => publisher.abort()}>
                        <XIcon/>
                        Cancel
                    </Button>
                {:else}
                    <p class="text-xs font-medium text-muted-foreground w-full relative overflow-hidden h-5">
                        {#if $allErrors.length}
                            <FlyInOut class="flex items-center gap-1">
                                <InfoIcon class="size-4"/>
                                Please fix the errors above before publishing.
                            </FlyInOut>
                        {:else if $submitting}
                            <FlyInOut class="flex items-center gap-1">
                                <LoaderCircleIcon class="animate-spin size-4"/>
                                Publishing...
                            </FlyInOut>
                        {:else if saveToDraft.pending}
                            <FlyInOut class="flex items-center gap-1">
                                <LoaderCircleIcon class="animate-spin size-4"/>
                                Saving draft...
                            </FlyInOut>
                        {:else if $tainted}
                            <FlyInOut class="flex items-center gap-1">
                                <CircleCheckIcon class="size-4"/>
                                Draft saved
                            </FlyInOut>
                        {:else}
                            <FlyInOut class="flex items-center gap-1">
                                <FileCheckCornerIcon class="size-4"/>
                                No changes to save
                            </FlyInOut>
                        {/if}
                    </p>
                {/if}
                <Button type="submit" disabled={disabled || !!$allErrors.length}>
                    {#if $submitting || publisher.isPublishing}
                        <LoaderCircleIcon class="animate-spin"/>
                        Publishing...
                    {:else}
                        <PlusIcon/>
                        Publish
                    {/if}
                </Button>
            </CardFooter>
        </Card>
    </form>
</div>