<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
    import TrackLikeSave from './TrackLikeSave.svelte';

    let {
        track
    }: {
        track: APIResponse.Get.TrackSignature;
    } = $props();

    let isSaved = $derived(savedLyrics.isSaved(track));
    let isLiked = $derived(savedLyrics.isLiked(track));
</script>

<Card class="gap-3">
    <CardHeader>
        <CardTitle>{track.trackName}</CardTitle>
        <CardDescription>{track.artistName} - {track.albumName}</CardDescription>
    </CardHeader>
    <CardContent class="h-full p-0 m-0"></CardContent>
    <CardFooter class="flex gap-2">
        <TrackLikeSave {track}/>
    </CardFooter>
</Card>