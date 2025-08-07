<script lang="ts">
    import lrclib, { ChallengeSolver } from 'lrclib.js';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
    import { CheckIcon, InfoIcon, LoaderIcon, ClockIcon, PenSquareIcon, AlertCircleIcon, CircleX } from '@lucide/svelte';
    import { Input } from '$lib/components/ui/input';
    import { FormButton, FormControl, FormField, FormFieldErrors, FormLabel } from '$lib/components/ui/form';
    import { defaults, superForm } from 'sveltekit-superforms';
    import { zod4, zod4Client, zodClient } from 'sveltekit-superforms/adapters';
    import { publishTrackSchema } from '$lib/helpers/schema';
    import { publishTrackDraft } from '$lib/helpers/metadata';
    import { toast } from 'svelte-sonner';
    import { useDebounce } from 'runed';
    import { formatDurationString, formatNumberString } from '$lib/helpers/utils';
    import { notifications } from '$lib/helpers/classes/Notifications.svelte';
    import InfoCard from '$lib/components/shared/InfoCard.svelte';
    import { publishNote as publishTrackNote } from '$lib/helpers/constants';
    import ImportMetadata from '$lib/components/shared/publish/ImportMetadata.svelte';
    import FlyInOut from '$lib/components/shared/FlyInOut.svelte';
    import { beforeNavigate } from '$app/navigation';
    import LyricsTextareaFields from '$lib/components/shared/publish/LyricsTextareaFields.svelte';

    let { data } = $props();

    let draftStatus: 'idle'|'saving'|'saved' = $state(Object.keys(data.form.data).length ? 'saved' : 'idle');
    let submitStatus: string|undefined = $state();
    let hashAttempts: number|undefined = $state();
    let hashStartTime: number|undefined = $state();
    let hashSolver: ChallengeSolver|undefined = $state();

    const form = superForm(data.form, {
        validators: zod4Client(publishTrackSchema),
        validationMethod: 'auto',
        dataType: 'json',
        taintedMessage: true,
        onChange: () => {
            draftStatus = 'saving';
            saveToDraft();
        },
        onError: err => {
            resetToken();
            console.error(err.result);
            notifications.send('Failed to publish track', {
                body: err.result.error.message,
                toastType: 'error'
            });
        },
        onSubmit: async data => {
            saveToDraft();

            if (notifications.permission === 'default') {
                toast(`Enable notification to get notified when track is published`, {
                    action: {
                        label: 'Enable',
                        onClick: () => notifications.askPermission()
                    }
                });
            }

            await solveChallenge(data.cancel)
                .catch(error => {
                    resetToken();
                    throw error;
                });

            submitStatus = 'Publishing';
        },
        onUpdate: async event => {
            if (event.result.type !== 'success') {
                notifications.send('Failed to publish track', {
                    body: event.result.data.message ?? 'Invalid form data',
                    toastType: 'error'
                });
                return;
            }

            notifications.send('Lyrics published!', {
                body: `Published track ${$formData.trackName}`,
                toastType: 'success'
            });

            form.reset(defaults(zod4(publishTrackSchema)));
            resetToken();

            publishTrackDraft.current = {};
            draftStatus = 'idle';
            submitStatus = undefined;
        }
    });

    const { form: formData, enhance, allErrors, submitting, tainted, capture, restore } = form;

    const saveToDraft = useDebounce(
        (notify: boolean = false) => {
            publishTrackDraft.current = $formData;
            draftStatus = Object.keys(publishTrackDraft.current).length ? 'saved' : 'idle';
            untaintForm();

            if (notify) toast.success('Saved publish track to draft');
        },
        () => 3000
    );

    function untaintForm() {
        formData.update(() => $formData, { taint: 'untaint-form' });
    }

    function resetToken() {
        hashAttempts = undefined;
        hashStartTime = undefined;
        hashSolver = undefined;
        $formData.token = undefined;
    }

    // TODO: idk WASM stuff so it's very slow unlike https://lrclibup.boidu.dev/ 😭
    async function solveChallenge(cancel: () => void) {
        submitStatus = 'Fetching challenge';

        const challenge = await lrclib.requestChallenge();

        submitStatus = 'Solving challenge';
        hashStartTime = Date.now();

        hashSolver = new ChallengeSolver(challenge, {
            onAttempt: s => hashAttempts = s.attempts,
            onAbort: () => cancel()
        });

        $formData.token = (await hashSolver.solve()).token;
    }

    function abortChallenge() {
        hashSolver?.abort();
        resetToken();
    }

    $effect(() => {
        form.validateForm({
            update: true
        });

        return () => {
            resetToken();
            abortChallenge();
        };
    });

    beforeNavigate(async navigate => {
        if (!$submitting || $tainted) return;

        const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!leave) navigate.cancel();
    });

    export const snapshot = { capture, restore };
</script>

<svelte:window
    onbeforeunload={event => {
        if (!$submitting || $tainted) return;

        event.preventDefault();
        event.returnValue = '';
    }}
    onkeydown={event => {
        const meta = event.metaKey || event.ctrlKey;

        if (meta && event.key === 's') {
            event.preventDefault();
            draftStatus = 'saving';
            saveToDraft(true);
        }
    }}
/>

<div class="sm:pt-0 pt-16 w-full max-w-4xl mx-auto grid gap-5">
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
                <LyricsTextareaFields {form}/>
                <InfoCard
                    icon={AlertCircleIcon}
                    title="Note"
                    description="Publishing a track requires solving a proof-of-work challenge. This process can take a few minutes, don't close this page till your track is published."
                />
                <div class="flex justify-end items-center gap-2">
                    {#if $submitting || draftStatus !== 'idle'}
                        {@const sharedClass = "flex items-center gap-1 w-full sm:justify-end sm:px-4 h-full font-semibold"}
                        <div class="relative w-full h-8 overflow-clip sm:text-end text-xs text-foreground/80 [&_svg]:size-4">
                            {#if $submitting}
                                {#if hashAttempts}
                                    <FlyInOut class={sharedClass}>
                                        {#key hashAttempts}
                                            <span>{formatDurationString(Date.now() - (hashStartTime ?? Date.now()))} • {formatNumberString(hashAttempts)} hash attempts</span>
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
                    {#if $submitting && submitStatus === 'Solving challenge'}
                        <FormButton type="button" variant="ghost" onclick={abortChallenge}>
                            Cancel
                        </FormButton>
                    {/if}
                    <FormButton type="submit" disabled={$submitting || !!$allErrors?.length}>
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