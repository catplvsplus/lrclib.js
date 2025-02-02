<script lang="ts">
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import type { APIOptions } from 'lrclib';
    import { Label } from '../ui/label';
    import { Input } from '../ui/input';
    import { Button } from '../ui/button';
    import { Search } from 'lucide-svelte';

    let {
        track_name = $bindable(""),
        artist_name = $bindable(""),
        album_name = $bindable(""),
        onChange,
        ...props
    }: {
        track_name?: string;
        artist_name?: string;
        album_name?: string;
        onChange?: (data: APIOptions.Get.SearchTrackSignature) => void;
        [key: string]: any;
    } = $props();

    let form: HTMLFormElement;

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        goto(`${base}/search?track_name=${encodeURIComponent(track_name)}&artist_name=${encodeURIComponent(artist_name)}&album_name=${encodeURIComponent(album_name)}`);
    }

    function updateSearch() {
        onChange?.({ track_name, artist_name: artist_name || undefined, album_name: album_name || undefined });
    }
</script>

<form bind:this={form} onsubmit={onSubmit} class="flex flex-col gap-2">
    <div>
        <div>
            <Label for="track_name">Track name</Label>
            <Input type="text" id="track_name" bind:value={track_name} placeholder="Track name" oninput={() => updateSearch()}/>
        </div>
    </div>
    <div class="flex gap-2">
        <div class="w-1/2">
            <Label for="artist_name">Artist name</Label>
            <Input type="text" id="artist_name" bind:value={artist_name} placeholder="Artist name" oninput={() => updateSearch()}/>
        </div>
        <div class="w-1/2">
            <Label for="album_name">Album name</Label>
            <Input type="text" id="album_name" bind:value={album_name} placeholder="Album name" oninput={() => updateSearch()}/>
        </div>
        <div class="shrink-0">
            <Label>&nbsp;</Label>
            <Button type="submit" class="flex" size="icon" disabled={!track_name}>
                <Search strokeWidth={2.5}/>
            </Button>
        </div>
    </div>
</form>

