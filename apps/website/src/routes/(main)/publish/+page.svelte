<script lang="ts">
    import lrclib from 'lrclib.js';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
    import { InfoIcon, LoaderIcon, ClockIcon, BadgeCheckIcon, SquarePenIcon, KeyIcon, CircleAlertIcon } from '@lucide/svelte';
    import { Input } from '$lib/components/ui/input';
    import { FormButton, FormControl, FormField, FormFieldErrors, FormLabel } from '$lib/components/ui/form';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { publishTrackSchema } from '$lib/helpers/schema';
    import { toast } from 'svelte-sonner';
    import { formatDurationString, formatNumberString } from '$lib/helpers/utils';
    import { notifications } from '$lib/helpers/classes/Notifications.svelte';
    import InfoCard from '$lib/components/shared/InfoCard.svelte';
    import { publishNote as publishTrackNote } from '$lib/helpers/constants';
    import ImportMetadata from '$lib/components/shared/publish/ImportMetadata.svelte';
    import FlyInOut from '$lib/components/shared/FlyInOut.svelte';
    import { beforeNavigate } from '$app/navigation';
    import LyricsTextareaFields from '$lib/components/shared/publish/LyricsTextareaFields.svelte';
    import { tokenSolver } from '$lib/helpers/classes/TokenSolver.svelte.js';
    import { publishDraft } from '$lib/helpers/classes/PublishDraft.svelte.js';
    import { MetaTags } from 'svelte-meta-tags';
    import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../../../lib/components/ui/input-group/index.js';

    let { data } = $props();

    let submitStatus: string|undefined = $state();

    const form = superForm(data.form, {
        validators: zodClient(publishTrackSchema),
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

            if (err.result.status === 400) resetToken();
        },
        onSubmit: async data => {
            saveToDraft();

            const cancel = () => {
                data.cancel();
                throw new Error('Challenge solving terminated');
            };

            if (notifications.permission === 'default') {
                toast(`Enable notification to get notified when track is published`, {
                    action: {
                        label: 'Enable',
                        onClick: () => notifications.askPermission()
                    }
                });
            }

            if (!$formData.token) {
                tokenSolver.onTerminatedEvent = cancel;

                if (tokenSolver.status === 'solving') {
                    submitStatus = 'Solving challenge';

                    $formData.token = await tokenSolver.onSolved.catch(cancel);
                } else if (!tokenSolver.status) {
                    submitStatus = 'Fetching challenge';

                    const challenge = await lrclib.requestChallenge();

                    submitStatus = 'Solving challenge';
                    $formData.token = await tokenSolver.solve(challenge).catch(cancel);
                }

                tokenSolver.onTerminatedEvent = null;
            }

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

            resetToken(false);

            notifications.send('Lyrics published!', {
                body: `Published track ${$formData.trackName}`,
                toastType: 'success'
            });

            publishDraft.set({});
            formData.set({
                trackName: '',
                albumName: '',
                artistName: '',
                duration: 0,
                plainLyrics: '',
                syncedLyrics: '',
            }, { taint: 'untaint-form' });
            submitStatus = undefined;
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

    function resetToken(terminate = true) {
        $formData.token = '';

        if (terminate) {
            tokenSolver.terminate();
        }

        tokenSolver.reset();
    }

    $effect(() => {
        form.validateForm({ update: true });

        return () => {
            if (tokenSolver.status !== 'solving') return;

            toast.warning('Publish token challenge is solving in the background', {
                action: {
                    label: 'Abort',
                    onClick: async () => {
                        await tokenSolver.terminate();
                        toast.success('Challenge solving aborted');
                    }
                }
            });
        }
    });

    beforeNavigate(async navigate => {
        if (!$submitting || $tainted) return;

        const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!leave) navigate.cancel();
    });

    let isGeneratingToken = $derived(tokenSolver.status === 'solving' || tokenSolver.status === 'idle');

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

<MetaTags
    title="Publish"
    titleTemplate="Lrclib.js | %s"
    description="Publish lyrics to Lrclib.js"
/>

<div class="sm:pt-0 pt-16 w-full mx-auto grid gap-5">
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
                <SquarePenIcon class="text-primary size-5"/>
                Track Info
            </CardTitle>
            <CardDescription>
                Enter the track information you want to publish
            </CardDescription>
        </CardHeader>
        <CardContent class="pt-4 border-t">
            <form method="POST" class="grid gap-4" use:enhance>
                <FormField {form} name="token">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Token</FormLabel>
                            <InputGroup class="flex">
                                <InputGroupInput {...props} bind:value={$formData.token} disabled={$submitting || isGeneratingToken} placeholder="Your publish token"/>
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        variant="secondary"
                                        type="button"
                                        class="overflow-hidden relative text-sm"
                                        disabled={$submitting || isGeneratingToken || !!$formData.token}
                                        onclick={async () => {
                                            resetToken();

                                            const challenge = await lrclib.requestChallenge();

                                            tokenSolver.onTerminatedEvent = () => {
                                                toast.error('Challenge solving aborted');
                                            };

                                            tokenSolver.solve(challenge)
                                                .then(data => {
                                                    $formData.token = data;
                                                    tokenSolver.onTerminatedEvent = null;
                                                    toast.success('Challenge solved, token generated');
                                                }).catch(err => {
                                                    if (err.message === 'Challenge solving aborted') return;
                                                    console.error(err);
                                                    toast.error('Failed to solve challenge');
                                                });
                                        }}
                                    >
                                        {#if isGeneratingToken}
                                            <FlyInOut class="flex gap-1 items-center" inY={30} outY={-30}>
                                                <LoaderIcon class="animate-spin size-3.5"/>
                                                <span>Loading</span>
                                            </FlyInOut>
                                        {:else}
                                            <FlyInOut class="flex gap-1 items-center" inY={30} outY={-30}>
                                                <KeyIcon class=" size-3.5"/>
                                                <span>Generate</span>
                                            </FlyInOut>
                                        {/if}
                                        <div class="flex gap-1 opacity-0 items-center">
                                            <KeyIcon class="size-3.5"/>
                                            <span>{tokenSolver.status === 'solving' ? 'Loading' : 'Generate'}</span>
                                        </div>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
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
                    icon={CircleAlertIcon}
                    title="Note"
                    description="Publishing a track requires solving a proof-of-work challenge. This process can take a few minutes, don't close this page till your track is published."
                />
                <div class="flex sm:justify-end sm:items-center gap-2 flex-col-reverse sm:flex-row">
                    {#if $submitting || publishDraft.status || tokenSolver.status === 'solving'}
                        {@const sharedClass = "flex items-center gap-1 w-full sm:justify-end justify-center sm:px-4 h-full font-semibold"}
                        <div class="relative w-full h-8 mt-4 sm:mt-0 overflow-clip sm:text-end text-xs text-foreground/60 [&_svg]:size-4">
                            {#if tokenSolver.status === 'solving' && $submitting}
                                <FlyInOut class={sharedClass}>
                                    {#key tokenSolver.attempts}
                                        <span>{formatDurationString(Date.now() - (tokenSolver.start ?? Date.now()))} • {formatNumberString(tokenSolver.attempts ?? 0)} hash attempts</span>
                                    {/key}
                                </FlyInOut>
                            {:else if tokenSolver.status === 'solved' && !$submitting}
                                <FlyInOut class={sharedClass}>
                                    <BadgeCheckIcon/>
                                    <span>Track is ready to publish</span>
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
                    {#if tokenSolver.status === 'solving' && $submitting}
                        <FormButton type="button" variant="secondary" onclick={() => tokenSolver.terminate()}>
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