<script lang="ts">
    import { queryParam } from 'sveltekit-search-params';
    import { lrclib, type Track as LrcTrack } from 'lrclib';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Input from '../../lib/components/ui/input/input.svelte';
    import type { FormInputEvent } from '../../lib/components/ui/input';
    import Player from '../../lib/components/Player.svelte';

    let id = queryParam('id');
    let track: LrcTrack|null = null;
    let file: File|null = null;

    onMount(async () => {
        if (!$id) return goto('/');

        track = await lrclib.fetchId($id).catch(e => null);
        if (!track) return goto('/');
    });

    function onFileChange(e: FormInputEvent<Event>) {
        file = e.currentTarget.files?.[0] ?? null;
    }
</script>

{#if !file || !track}
    <div class="h-full w-full flex justify-center items-center">
        <div class="flex flex-col gap-4">
            <h2 class="text-2xl text-center font-medium">Select an audio file</h2>
            <Input type="file" accept="audio/*" on:change={onFileChange}/>
        </div>
    </div>
{:else}
    <Player track={track} audio={URL.createObjectURL(file)} blob={file}/>
{/if}