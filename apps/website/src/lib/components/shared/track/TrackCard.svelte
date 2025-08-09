<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
    import TrackLikeSave from './TrackLikeSave.svelte';
    import { resolve } from '$app/paths';
    import type { Snippet } from 'svelte';

    let {
        track,
        header,
        content,
        footer
    }: {
        track: APIResponse.Get.TrackSignature;
        header?: Snippet;
        content?: Snippet;
        footer?: Snippet;
    } = $props();
</script>

<Card class="gap-3">
    <CardHeader>
        <CardTitle>
            <a href={resolve('/(main)/track/[id]', { id: String(track.id) })}>
                {track.trackName}
            </a>
        </CardTitle>
        <CardDescription>{track.artistName} • {track.albumName}</CardDescription>
        {@render header?.()}
    </CardHeader>
    <CardContent class="h-full p-0 m-0">{@render content?.()}</CardContent>
    <CardFooter class="flex gap-2">
        <TrackLikeSave {track}/>
        {@render footer?.()}
    </CardFooter>
</Card>