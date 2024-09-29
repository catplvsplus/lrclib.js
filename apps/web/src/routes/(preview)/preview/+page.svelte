<script lang="ts">
    import { queryParam } from 'sveltekit-search-params';
    import { lrclib, type Track as LrcTrack } from 'lrclib';
    import { onDestroy, onMount } from 'svelte';
    import { goto, pushState } from '$app/navigation';
    import Player from '$lib/components/Player.svelte';
    import { isPlaying } from '$lib/stores/isPlaying';
    import Dropzone from 'svelte-file-dropzone';
    import { page } from '$app/stores';
    import isMobile from 'is-mobile';
    import Input from '../../../lib/components/ui/input/input.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    let id = queryParam('id');
    let track: LrcTrack|null = null;
    let file: File|null = null;
    let audioURL: string|null = null;

    onMount(async () => {
        if (!$id) return goto('/');

        track = await lrclib.fetchId($id).catch(e => null);
        if (!track) return goto('/');
    });

    onDestroy(() => {
        if (audioURL) URL.revokeObjectURL(audioURL);

        $isPlaying = false;
    });

    function onFileDrop(e: { detail: { acceptedFiles: File[]; fileRejections: File[] }}) {
        file = e.detail.acceptedFiles?.[0] ?? null;
        audioURL = file && URL.createObjectURL(file);

        $isPlaying = !!audioURL;
        pushState('', { playing: !!audioURL });
    }
</script>

<svelte:head>
    <title>{track?.trackName ? `Lrclib.js | ${track.trackName}` : 'Lrclib.js'}</title>
</svelte:head>
<MetaTags title="Lrclib.js | {track?.trackName ?? 'Preview'}" description="Preview synced lyrics from Lrclib.js"/>

{#if !file || !audioURL || !track || !$page.state.playing}
    <div class="h-full w-full flex justify-center items-center">
        <div class="flex flex-col gap-4 w-full max-w-96 p-4">
            <h2 class="text-2xl text-center font-medium">Select an audio file</h2>
            {#if !isMobile()}
                <Dropzone
                    accept="audio/*"
                    multiple={false}
                    required={true}
                    containerStyles="background: var(--background); border-radius: var(--radius); color: hsl(var(--primary)); border: 2px dashed hsl(var(--primary)); font-weight: 500; text-align: center;"
                    on:drop={onFileDrop}
                >
                    <p>Choose audio to upload</p>
                    <p class="opacity-40">or</p>
                    <p>Drag and drop it here</p>
                </Dropzone>
            {:else}
                <Input
                    type="file"
                    accept="audio/*"
                    required={true}
                    class="w-full border-primary"
                    on:change={t => onFileDrop({
                        detail: {
                            acceptedFiles: t.currentTarget.files ? [t.currentTarget.files[0]] : [],
                            fileRejections: []
                        }
                    })}
                />
            {/if}
        </div>
    </div>
{:else}
    <Player track={track} lyrics={track.isSynced ? track.syncedLyricsJSON : track.plainLyrics} audio={audioURL} blob={file} name={file.name}/>
{/if}