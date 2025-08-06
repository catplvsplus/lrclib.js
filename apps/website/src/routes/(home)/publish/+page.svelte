<script lang="ts">
    import lrclib, { ChallengeSolver, LRC, type APIPublishTokenData, type APIResponse } from 'lrclib.js';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
    import { CheckIcon, InfoIcon, LoaderIcon, ClockIcon, PenIcon, PenSquareIcon, AlertTriangleIcon, AlertCircleIcon, ArrowLeftRightIcon } from '@lucide/svelte';
    import { Input } from '$lib/components/ui/input';
    import { FormButton, FormControl, FormField, FormFieldErrors, FormLabel } from '$lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { publishTrackSchema } from '$lib/helpers/schema';
    import { Textarea } from '$lib/components/ui/textarea/index';
    import { publishTrackDraft } from '$lib/helpers/metadata';
    import { toast } from 'svelte-sonner';
    import { useDebounce } from 'runed';
    import { resolve } from '$app/paths';
    import { formatDurationString, formatNumberString } from '$lib/helpers/utils';
    import { notifications } from '$lib/helpers/classes/Notifications.svelte';
    import InfoCard from '$lib/components/shared/InfoCard.svelte';
    import { publishNote as publishTrackNote } from '$lib/helpers/constants';
    import ImportMetadata from '$lib/components/shared/publish/ImportMetadata.svelte';
    import FlyInOut from '$lib/components/shared/FlyInOut.svelte';
    import { Button } from '$lib/components/ui/button';

    let { data } = $props();

    let draftStatus: 'idle'|'saving'|'saved' = $state(Object.keys(data.form.data).length ? 'saved' : 'idle');
    let submitStatus: string|undefined = $state();
    let hashAttempts: number|undefined = $state();
    let hashStartTime: number|undefined = $state();
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

            if (notifications.permission === 'default') {
                notifications.askPermission();
                toast(`Enable notification to get notified when track is published`);
            }

            draftStatus = 'idle';
            submitStatus = 'Fetching challenge';

            challenge ??= await lrclib.requestChallenge();

            submitStatus = 'Solving challenge';
            hashStartTime = Date.now();

            const solver = new ChallengeSolver(challenge);

            solver.onAttempt = () => hashAttempts = solver.attempts;

            token ??= await solver.solve();

            submitStatus = 'Publishing';

            await fetch(resolve('/(home)/publish'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Publish-Token': `${challenge.prefix}:${token.nonce}`
                },
                body: JSON.stringify({
                    ...data.form.data,
                    token
                })
            })
            .then(async res => {
                if (!res.ok) throw new Error((await res.json())?.message ?? 'Failed to publish track');

                notifications.send('Lyrics published!', {
                    body: `Published track ${data.form.data.trackName}`
                });

                challenge = undefined;
                token = undefined;
            })
            .catch(error => {
                data.cancel();
                console.error(error);
                notifications.send('Failed to publish track', {
                    body: error.message
                });
            })
            .finally(() => {
                submitStatus = undefined;
                hashAttempts = undefined;
                hashStartTime = undefined;
            });
        }
    });

    const { form: formData, enhance, allErrors, submitting, tainted } = form;

    const saveToDraft = useDebounce(
        () => {
            publishTrackDraft.current = $formData;
            draftStatus = 'saved';
        },
        () => 3000
    );

    let canImportFromSynced = $derived(!!$formData.syncedLyrics?.trim() && !$formData.plainLyrics?.trim());

    function syncedToPlain() {
        $formData.plainLyrics = LRC.toPlain(LRC.parse($formData.syncedLyrics ?? '')).trim();
    }

    $effect(() => {
        form.validateForm({
            update: true
        });

        return () => {
            challenge = undefined;
            token = undefined;
        }
    });
</script>

<div class="pt-16 w-full max-w-4xl mx-auto grid gap-5">
    <ImportMetadata
        setMetadata={metadata => {
            $formData = {
                ...$formData,
                ...metadata,
                plainLyrics: metadata.plainLyrics ?? $formData.plainLyrics,
                syncedLyrics: metadata.syncedLyrics ?? $formData.syncedLyrics
            };
        }}
        disabled={$submitting}
    />
    <InfoCard
        icon={InfoIcon}
        title="Important"
        description={publishTrackNote}
    />
    <Card class="gap-0">
        <CardHeader class="pb-4">
            <CardTitle class="flex items-center gap-1">
                <PenSquareIcon class="text-primary size-5"/>
                Track Info
            </CardTitle>
            <CardDescription>
                Enter the track information you want to publish
            </CardDescription>
        </CardHeader>
        <CardContent class="pt-4 border-t">
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
                <div class="flex md:flex-row flex-col gap-5">
                    <FormField {form} name="syncedLyrics" class="md:w-1/2">
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>Synced Lyrics</FormLabel>
                                <Textarea {...props} bind:value={$formData.syncedLyrics} disabled={$submitting} placeholder="[00:00.000] Some lyrics" class="min-h-56 max-h-dvh font-mono"/>
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors/>
                    </FormField>
                    <FormField {form} name="plainLyrics" class="md:w-1/2">
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>Plain Lyrics</FormLabel>
                                <Textarea {...props} bind:value={$formData.plainLyrics} disabled={$submitting} placeholder="Some lyrics" class="min-h-56 max-h-dvh font-mono"/>
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
                <InfoCard
                    icon={AlertCircleIcon}
                    title="Note"
                    description="Publishing a track requires solving a proof-of-work challenge. This process can take a few minutes, don't close this page till your track is published."
                />
                <div class="flex justify-end items-center gap-2">
                    {#if $submitting || draftStatus !== 'idle'}
                        {@const sharedClass = "flex items-center gap-1 w-full sm:justify-end sm:px-4 h-full font-semibold"}
                        <div class="relative w-full h-8 overflow-clip text-end text-xs text-foreground/80 [&_svg]:size-4">
                            {#if $submitting}
                                {#if hashAttempts}
                                    <FlyInOut class={sharedClass}>
                                        {#key hashAttempts}
                                            <span>{formatDurationString(Date.now() - (hashStartTime ?? Date.now()))} • {formatNumberString(hashAttempts)} hash</span>
                                        {/key}
                                    </FlyInOut>
                                {:else}
                                    <FlyInOut class={sharedClass}>
                                        <ClockIcon/>
                                        <span>{submitStatus}</span>
                                    </FlyInOut>
                                {/if}
                            {:else if draftStatus === 'saving'}
                                <FlyInOut class={sharedClass}>
                                    <LoaderIcon class="animate-spin"/>
                                    <span>Saving to Draft</span>
                                </FlyInOut>
                            {:else if draftStatus === 'saved'}
                                <FlyInOut class={sharedClass}>
                                    <CheckIcon/>
                                    <span>Saved to Draft</span>
                                </FlyInOut>
                            {/if}
                        </div>
                    {/if}
                    <FormButton type="submit" class="btn btn-primary" disabled={$submitting || !!$allErrors?.length}>
                        {#if $submitting}
                            <LoaderIcon class="animate-spin"/>
                        {:else}
                            Publish
                        {/if}
                    </FormButton>
                </div>
            </form>
        </CardContent>
    </Card>
    <p class="text-center text-xs text-muted-foreground">Inspired by <a class="text-primary" href="https://lrclibup.boidu.dev/" target="_blank">lrclibup.boidu.dev</a></p>
</div>