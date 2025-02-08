<script lang="ts">
    import { error } from '@sveltejs/kit';
    import { lrclib, type Track } from 'lrclib';
    import { queryParam, ssp } from 'sveltekit-search-params';
    import NavBar from '../../lib/components/shared/NavBar.svelte';
    import { Input } from '../../lib/components/ui/input';
    import { pushState } from '$app/navigation';
    import { page } from '$app/state';
    import Player from './components/Player.svelte';

    let buffer: File|null = $state(null);
    let track: Track|null = $state(null);
    let id = queryParam('id', ssp.number());

    $effect(() => {
        if (id) fetchTrack();
    })

    async function fetchTrack() {
        if (!$id) error(404, 'No track ID provided');
        track = await lrclib.fetchTrackById($id, false);
    }

    function onFileChange(e: Event & { currentTarget: HTMLInputElement }) {
        const file = e.currentTarget.files?.[0];
        if (!file) return;

        buffer = file;
        if (!page.state.previewPlaying) pushState('', { previewPlaying: true });
    }
</script>

<svelte:head>
    <title>Preview | {track?.trackName ?? 'Loading...'}</title>
</svelte:head>

{#if track}
    {#if !buffer || !page.state.previewPlaying}
        <NavBar/>
        <div class="h-full w-full pt-16 flex justify-center items-center">
            <div class="p-7 text-center">
                <h1 class="text-3xl font-semibold">Preview {track.trackName}</h1>
                <p class="text-muted-foreground">Select an audio file to preview lyrics</p>
                <Input
                    type="file"
                    accept="audio/*"
                    class="mt-5 w-64 inline-block"
                    onchange={onFileChange}
                />
            </div>
        </div>
    {:else}
        <Player bind:track={track} bind:file={buffer}/>
    {/if}
{/if}