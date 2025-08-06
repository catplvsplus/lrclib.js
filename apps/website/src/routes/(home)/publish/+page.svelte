<script lang="ts">
    import lrclib, { ChallengeSolver, type APIPublishTokenData, type APIResponse } from 'lrclib.js';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../lib/components/ui/card';
    import { CheckIcon, FileInputIcon, LoaderIcon, PencilRulerIcon } from '@lucide/svelte';
    import { Input } from '../../../lib/components/ui/input';
    import { FormButton, FormControl, FormField, FormFieldErrors, FormLabel } from '../../../lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { publishTrackSchema, type PublishTrackSchema } from '../../../lib/helpers/schema';
    import { Textarea } from '../../../lib/components/ui/textarea/index';
    import { parseAudioMetadata, parseLRCMetadata, publishTrackDraft } from '../../../lib/helpers/metadata';
    import { toast } from 'svelte-sonner';
    import { useDebounce } from 'runed';
    import { settings } from '../../../lib/helpers/classes/Settings.svelte';
    import { fly } from 'svelte/transition';
    import { Button } from '../../../lib/components/ui/button';
    import { askNotificationPermission, getNotificationPermission, sendNotification } from '../../../lib/helpers/notification';
    import { resolve } from '$app/paths';

    let { data } = $props();

    let draftStatus: 'idle'|'saving'|'saved' = $state(Object.keys(data.form.data).length ? 'saved' : 'idle');
    let submitStatus: string|undefined = $state();
    let challenge: APIResponse.Post.RequestChallenge|undefined = $state();
    let token: APIPublishTokenData|undefined = $state();

    const form = superForm(data.form, {
        SPA: true,
        validators: zodClient(publishTrackSchema),
        validationMethod: 'oninput',
        dataType: 'json',
        taintedMessage: true,
        onChange: () => {
            draftStatus = 'saving';
            saveToDraft();
        },
        onUpdate: async data => {
            saveToDraft();

            if (getNotificationPermission() === 'default') {
                askNotificationPermission();
                toast(`Enable notification to get notified when track is published`);
            }

            draftStatus = 'idle';
            submitStatus = 'Fetching challenge';

            challenge ??= await lrclib.requestChallenge();

            submitStatus = 'Solving challenge';
            console.log($state.snapshot(challenge));

            token ??= await (new ChallengeSolver(challenge)).solve();

            submitStatus = 'Publishing';
            console.log($state.snapshot(token));

            await fetch(resolve('/(home)/publish'), {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'X-Publish-Token': `${challenge.prefix}:${token.nonce}`
                }),
                body: JSON.stringify({
                    ...data.form.data,
                    token
                })
            })
            .then(async res => {
                if (!res.ok) throw new Error((await res.json())?.message ?? 'Failed to publish track');

                sendNotification('Lyrics published!', {
                    body: `Published track ${data.form.data.trackName}`
                });

                challenge = undefined;
                token = undefined;
            })
            .catch(error => {
                data.cancel();
                console.error(error);
                sendNotification('Failed to publish track', {
                    body: error.message
                });
            });

            submitStatus = undefined;
        }
    });

    const { form: formData, enhance, allErrors, submitting, tainted } = form;

    async function importFromFile(event: Event & { currentTarget: HTMLInputElement }) {
        const files = event.currentTarget.files;
        if (!files?.length) return;

        const file = files[0];

        if (file) {
            let metadata: Partial<Omit<APIResponse.Get.TrackSignature, 'id'|'instrumental'>>;

            switch (file.name.split('.').pop()) {
                case 'lrc':
                    metadata = await parseLRCMetadata(file);
                    break;
                default:
                    metadata = await parseAudioMetadata(file);
            }

            $formData = {
                ...$formData,
                ...metadata,
                plainLyrics: metadata.plainLyrics ?? $formData.plainLyrics,
                syncedLyrics: metadata.syncedLyrics ?? $formData.syncedLyrics
            };
        }
    }

    const saveToDraft = useDebounce(
        () => {
            publishTrackDraft.current = $formData;
            draftStatus = 'saved';
        },
        () => 3000
    );

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
            <Input type="file" accept="audio/*,.lrc" onchange={importFromFile}/>
        </CardContent>
    </Card>
    <Card>
        <CardContent>
            <form method="POST" class="grid gap-4" use:enhance>
                <FormField {form} name="trackName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Track Title</FormLabel>
                            <Input {...props} bind:value={$formData.trackName} disabled={$submitting} placeholder="Some song (ft. some artist)"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="artistName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Artist Name</FormLabel>
                            <Input {...props} bind:value={$formData.artistName} disabled={$submitting} placeholder="Some artist"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="albumName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Album Name</FormLabel>
                            <Input {...props} bind:value={$formData.albumName} disabled={$submitting} placeholder="Some album"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="duration">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Duration<span class="text-foreground/50">(in seconds)</span></FormLabel>
                            <Input {...props} bind:value={$formData.duration} disabled={$submitting} placeholder="120" type="number"/>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <div class="flex sm:flex-row flex-col gap-5">
                    <FormField {form} name="syncedLyrics" class="sm:w-1/2">
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>Synced Lyrics</FormLabel>
                                <Textarea {...props} bind:value={$formData.syncedLyrics} disabled={$submitting} placeholder="[00:00.000] Some lyrics" class="min-h-56 max-h-dvh font-mono"/>
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors/>
                    </FormField>
                    <FormField {form} name="plainLyrics" class="sm:w-1/2">
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>Plain Lyrics</FormLabel>
                                <Textarea {...props} bind:value={$formData.plainLyrics} disabled={$submitting} placeholder="Some lyrics" class="min-h-56 max-h-dvh font-mono"/>
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors/>
                    </FormField>
                </div>
                <div class="flex justify-end items-center gap-2">
                    <Button type="button" class="relative overflow-clip w-36 text-xs opacity-80!" variant="outline" disabled>
                        {#key draftStatus || submitStatus}
                            <span
                                class="absolute flex items-center gap-1"
                                in:fly={{ y: 30, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
                                out:fly={{ y: -30, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
                            >
                                {#if submitStatus}
                                    {submitStatus}
                                {:else if draftStatus === 'saving'}
                                    <LoaderIcon class="animate-spin size-4!"/>
                                    <span>Saving to Draft</span>
                                {:else if draftStatus === 'saved'}
                                    <CheckIcon class="size-4!"/>
                                    <span>Saved to Draft</span>
                                {:else}
                                    <PencilRulerIcon class="size-4!"/>
                                    <span>Save to Draft</span>
                                {/if}
                            </span>
                        {/key}
                    </Button>
                    <FormButton type="submit" class="btn btn-primary" disabled={$submitting || !!$allErrors?.length}>
                        {#if $submitting}
                            <LoaderIcon class="animate-spin"/>
                        {:else}
                            Submit
                        {/if}
                    </FormButton>
                </div>
            </form>
        </CardContent>
    </Card>
</div>