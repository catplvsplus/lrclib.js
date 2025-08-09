<script lang="ts">
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from '../../../../lib/components/ui/card';
    import { Music2Icon, MusicIcon, PlayIcon } from '@lucide/svelte';
    import TrackActions from '$lib/components/shared/track/TrackActions.svelte';
    import TrackShareButton from '$lib/components/shared/track/TrackShareButton.svelte';
    import TrackDownloadButton from '../../../../lib/components/shared/track/TrackDownloadButton.svelte';
    import { Button } from '../../../../lib/components/ui/button';

    let { data } = $props();

    let isSaved = $derived(savedLyrics.isSaved(data.track));
    let isLiked = $derived(savedLyrics.isLiked(data.track));
</script>

<MetaTags
    title={data.track.trackName}
    titleTemplate="Lrclib.js | %s"
    description={`${data.track.trackName} by ${data.track.artistName}`}
/>

<div class="sm:pt-0 pt-16 w-full mx-auto grid gap-5">
    <Card class="w-full">
        <CardHeader>
            <CardTitle class="flex items-center gap-1">
                <MusicIcon class="text-primary size-5"/>
                {data.track.trackName}
            </CardTitle>
            <CardDescription>
                {data.track.artistName} • {data.track.albumName}
            </CardDescription>
            <CardAction>
                <TrackShareButton track={data.track} class="text-muted-foreground bg-muted/90"/>
            </CardAction>
        </CardHeader>
        <CardFooter class="grid lg:flex gap-2 grid-cols-4">
            <TrackActions
                track={data.track}
                class="text-sm font-bold text-muted-foreground bg-muted/90 w-full col-span-2 md:col-span-1 lg:w-fit"
            />
            <Button variant="secondary" class="text-sm font-bold text-muted-foreground bg-muted/90 w-full col-span-3 md:col-span-1 lg:w-fit">
                <PlayIcon/>
                <span>Preview</span>
            </Button>
            <TrackDownloadButton
                track={data.track}
                class="text-sm font-bold text-muted-foreground bg-muted/90 w-full col-span-1 md:col-span-1 lg:w-fit"
                labelClass="hidden md:inline"
            />
        </CardFooter>
    </Card>
</div>