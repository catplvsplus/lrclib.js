<script lang="ts">
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import type { APIOptions } from 'lrclib';
    import { Label } from '../ui/label';
    import { Input } from '../ui/input';
    import { Button } from '../ui/button';
    import { Search } from 'lucide-svelte';
    import { cn } from '../../helpers/utils';
    import { parseBlob } from 'music-metadata';

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
    let parsingAudioFile = $state(false);

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        onChange?.({ track_name, artist_name, album_name });
        goto(`${base}/search?track_name=${encodeURIComponent(track_name)}&artist_name=${encodeURIComponent(artist_name)}&album_name=${encodeURIComponent(album_name)}`);
    }

    function updateSearch() {
        onChange?.({ track_name, artist_name: artist_name || undefined, album_name: album_name || undefined });
    }

    async function parseAudioFile(event: Event & { currentTarget: HTMLInputElement }) {
        const file = event.currentTarget.files?.[0];
        if (!file) return;

        parsingAudioFile = true;

        const metadata = await parseBlob(file).catch(() => null);

        track_name = metadata?.common.title ?? track_name;
        artist_name = metadata?.common.artist ?? artist_name;
        album_name = metadata?.common.album ?? album_name;

        updateSearch();

        parsingAudioFile = false;
        event.currentTarget.files = null;
    }
</script>

<form bind:this={form} onsubmit={onSubmit} class="flex flex-col gap-2">
    <div>
        <div>
            <Label for="audio_file">Audio File</Label>
            <Input type="file" id="audio_file" accept="audio/*" onchange={parseAudioFile}/>
        </div>
    </div>
    <hr>
    <div>
        <div>
            <Label for="track_name">Track name</Label>
            <Input type="text" id="track_name" bind:value={track_name} placeholder="Track name" oninput={() => updateSearch()} disabled={parsingAudioFile}/>
        </div>
    </div>
    <div class="flex gap-2">
        <div class="w-1/2">
            <Label for="artist_name">Artist name</Label>
            <Input type="text" id="artist_name" bind:value={artist_name} placeholder="Artist name" oninput={() => updateSearch()} disabled={parsingAudioFile}/>
        </div>
        <div class={cn("w-[calc(50%-3rem)]")}>
            <Label for="album_name">Album name</Label>
            <Input type="text" id="album_name" bind:value={album_name} placeholder="Album name" oninput={() => updateSearch()} disabled={parsingAudioFile}/>
        </div>
        <div class="shrink-0">
            <Label>&nbsp;</Label>
            <Button type="submit" class="flex" size="icon" disabled={!track_name || parsingAudioFile}>
                <Search strokeWidth={2.5}/>
            </Button>
        </div>
    </div>
</form>

