<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
    import TrackLikeSave from './TrackActions.svelte';
    import { resolve } from '$app/paths';

    let {
        track
    }: {
        track: APIResponse.Get.TrackSignature;
    } = $props();
</script>

<Card class="gap-3">
    <CardHeader>
        <CardTitle>
            <a href={resolve('/(main)/track/[id]', { id: String(track.id) })} class="hover:underline">
                {track.trackName}
            </a>
        </CardTitle>
        <CardDescription>{track.artistName} • {track.albumName}</CardDescription>
    </CardHeader>
    <CardContent class="h-full p-0 m-0"></CardContent>
    <CardFooter class="grid grid-cols-2 gap-2 flex-col">
        <TrackLikeSave {track} class="text-sm font-bold text-muted-foreground bg-muted/90"/>
    </CardFooter>
</Card>