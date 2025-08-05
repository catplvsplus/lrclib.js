<script lang="ts">
    import lrclib, { ChallengeSolver, type APIPublishTokenData, type APIResponse } from 'lrclib.js';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../lib/components/ui/card';
    import { FileInputIcon } from '@lucide/svelte';
    import { Input } from '../../../lib/components/ui/input';
    import { FormButton, FormControl, FormField, FormFieldErrors, FormLabel } from '../../../lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { publishTrackSchema } from '../../../lib/helpers/schema';
    import { Textarea } from '../../../lib/components/ui/textarea/index';

    let { data } = $props();

    let fileInput: HTMLInputElement|null = $state(null);

    function importFromFile(event: Event & { currentTarget: HTMLInputElement }) {
        const files = event.currentTarget.files;
        if (!files?.length) return;

        const file = files[0];

        event.currentTarget.value = "";
        event.currentTarget.files = null;
    }

    const form = superForm(data.form, {
        validators: zodClient(publishTrackSchema),
        validationMethod: 'oninput',
        taintedMessage: true
    });

    const { form: formData, enhance, allErrors, submitting } = form;

    $effect(() => {
        form.validateForm({
            update: true
        });
    });
</script>

<div class="pt-16 w-full max-w-4xl mx-auto grid gap-5">
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-1">
                <FileInputIcon class="text-primary size-5"/>
                Import Lyrics
            </CardTitle>
            <CardDescription>
                Import lyrics from audio file or .lrc file
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Input type="file" accept="audio/*,.lrc" bind:ref={fileInput} onchange={importFromFile}/>
        </CardContent>
    </Card>
    <Card>
        <CardContent>
            <form method="POST" class="grid gap-4" use:enhance>
                <FormField {form} name="trackName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Track Title</FormLabel>
                            <Input {...props} bind:value={$formData.trackName} placeholder="Some song (ft. some artist)"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="artistName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Artist Name</FormLabel>
                            <Input {...props} bind:value={$formData.artistName} placeholder="Some artist"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="albumName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Album Name</FormLabel>
                            <Input {...props} bind:value={$formData.albumName} placeholder="Some album"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="duration">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Duration<span class="text-foreground/50">(in seconds)</span></FormLabel>
                            <Input {...props} bind:value={$formData.duration} placeholder="120" type="number"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <div class="flex sm:flex-row flex-col gap-5">
                    <FormField {form} name="syncedLyrics" class="sm:w-1/2">
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>Synced Lyrics</FormLabel>
                                <Textarea {...props} bind:value={$formData.syncedLyrics} placeholder="[00:00.000] Some lyrics" class="h-56"/>
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors/>
                    </FormField>
                    <FormField {form} name="plainLyrics" class="sm:w-1/2">
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>Plain Lyrics</FormLabel>
                                <Textarea {...props} bind:value={$formData.plainLyrics} placeholder="Some lyrics" class="h-56"/>
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors/>
                    </FormField>
                </div>
                <FormButton type="submit" class="btn btn-primary" disabled={$submitting || !!$allErrors?.length}>Submit</FormButton>
            </form>
        </CardContent>
    </Card>
</div>