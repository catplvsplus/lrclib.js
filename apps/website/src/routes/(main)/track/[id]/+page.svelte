<script lang="ts">
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from '../../../../lib/components/ui/card';
    import { MusicIcon, PlayIcon } from '@lucide/svelte';
    import TrackActions from '$lib/components/shared/track/TrackActions.svelte';
    import TrackShareButton from '$lib/components/shared/track/TrackShareButton.svelte';
    import TrackDownloadButton from '$lib/components/shared/track/TrackDownloadButton.svelte';
    import { Button } from '@/components/ui/button';
    import TrackLyricsPreview from '$lib/components/shared/track/TrackLyricsPreview.svelte';

    let { data } = $props();

    let isSaved = $derived(savedLyrics.isSaved(data.track));
    let isLiked = $derived(savedLyrics.isLiked(data.track));
</script>

<MetaTags
    title={data.track.trackName}
    titleTemplate="Lrclib.js | %s"
    description={`${data.track.trackName} by ${data.track.artistName}`}
/>

<div class="sm:pt-0 pt-16 w-full mx-auto max-w-4xl grid gap-5">
    <Card class="w-full">
        <CardHeader>
            <CardTitle>
                {data.track.trackName}
            </CardTitle>
            <CardDescription>
                {data.track.artistName} • {data.track.albumName}
            </CardDescription>
            <CardAction>
                <TrackShareButton track={data.track} class="text-muted-foreground bg-muted/90" labelClass="hidden md:inline"/>
            </CardAction>
        </CardHeader>
        <CardFooter class="grid lg:flex gap-2 grid-cols-4 border-t">
            <TrackActions
                track={data.track}
                class="text-sm font-bold bg-muted/90 w-full col-span-2 md:col-span-1 lg:w-fit"
            />
            <Button variant="secondary" class="text-sm font-bold bg-muted/90 w-full col-span-3 md:col-span-1 lg:w-fit">
                <PlayIcon/>
                <span>Preview</span>
            </Button>
            <TrackDownloadButton
                track={data.track}
                class="text-sm font-bold bg-muted/90 w-full col-span-1 md:col-span-1 lg:w-fit"
                labelClass="hidden md:inline"
            />
        </CardFooter>
    </Card>
    <TrackLyricsPreview track={data.track}/>
</div>