<script lang="ts">
    import lrclib from 'lrclib.js';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
    import { InfoIcon, LoaderIcon, ClockIcon, PenSquareIcon, AlertCircleIcon, CircleX, BadgeCheckIcon } from '@lucide/svelte';
    import { Input } from '$lib/components/ui/input';
    import { FormButton, FormControl, FormField, FormFieldErrors, FormLabel } from '$lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { publishTrackSchema } from '$lib/helpers/schema';
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
    import { tokenSolver } from '$lib/helpers/classes/TokenSolver.svelte.js';
    import { publishDraft } from '../../../lib/helpers/classes/PublishDraft.svelte.js';

    let { data } = $props();

    let submitStatus: string|undefined = $state();

    const form = superForm(data.form, {
        validators: zod4Client(publishTrackSchema),
        validationMethod: 'auto',
        dataType: 'json',
        taintedMessage: true,
        onChange: () => saveToDraft(),
        onError: err => {
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

            if (tokenSolver.status === 'solving') {
                submitStatus = 'Solving challenge';
                await tokenSolver.onSolved;
            } else {
                submitStatus = 'Fetching challenge';

                const challenge = await lrclib.requestChallenge();

                submitStatus = 'Solving challenge';
                await tokenSolver.solve(challenge, () => {
                    data.cancel();
                    throw new Error('Challenge solving aborted');
                });
            }

            $formData.token = tokenSolver.solver?.token;
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

            tokenSolver.reset(true);

            notifications.send('Lyrics published!', {
                body: `Published track ${$formData.trackName}`,
                toastType: 'success'
            });

            publishDraft.set({});
            submitStatus = undefined;
            $formData = {};
        }
    });

    const { form: formData, enhance, allErrors, submitting, tainted, capture, restore } = form;

    async function saveToDraft({ notify, instant }: { notify?: boolean; instant?: boolean } = {}) {
        if (!instant) {
            await publishDraft.save($formData);
        } else {
            publishDraft.set($formData);
        }

        if (notify) toast.success('Saved publish track to draft');
        untaintForm();
    }

    function untaintForm() {
        formData.update(() => $formData, { taint: 'untaint-form' });
    }

    $effect(() => {
        form.validateForm({ update: true });
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
            saveToDraft({ notify: true, instant: true });
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
                <div class="flex sm:justify-end sm:items-center gap-2 flex-col-reverse sm:flex-row">
                    {#if $submitting || publishDraft.status || tokenSolver.status === 'solving'}
                        {@const sharedClass = "flex items-center gap-1 w-full sm:justify-end justify-center sm:px-4 h-full font-semibold"}
                        <div class="relative w-full h-8 mt-4 sm:mt-0 overflow-clip sm:text-end text-xs text-foreground/60 sm:text-foreground/80 [&_svg]:size-4">
                            {#if tokenSolver.status === 'solving'}
                                <FlyInOut class={sharedClass}>
                                    {#key tokenSolver.attempts}
                                        <span>{formatDurationString(Date.now() - (tokenSolver.solver?.solveStartTime ?? Date.now()))} • {formatNumberString(tokenSolver.attempts ?? 0)} hash attempts</span>
                                    {/key}
                                </FlyInOut>
                            {:else if $submitting}
                                <FlyInOut class={sharedClass}>
                                    <ClockIcon/>
                                    <span>{submitStatus}</span>
                                </FlyInOut>
                            {:else if publishDraft.status === 'saving'}
                                <FlyInOut class={sharedClass}>
                                    <LoaderIcon class="animate-spin"/>
                                    <span>Saving to Draft</span>
                                </FlyInOut>
                            {:else if publishDraft.status === 'saved'}
                                <FlyInOut class={sharedClass}>
                                    <BadgeCheckIcon/>
                                    <span>Saved to Draft</span>
                                </FlyInOut>
                            {/if}
                        </div>
                    {/if}
                    {#if tokenSolver.status === 'solving'}
                        <FormButton type="button" variant="secondary" onclick={tokenSolver.abort}>
                            Cancel
                        </FormButton>
                    {/if}
                    <FormButton type="submit" disabled={$submitting || !!$allErrors?.length || tokenSolver.status === 'solving'}>
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