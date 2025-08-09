<script lang="ts">
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import TrackCard from '../../../../lib/components/shared/track/TrackCard.svelte';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from '../../../../lib/components/ui/card';
    import Button from '../../../../lib/components/ui/button/button.svelte';
    import { ArrowDownIcon, ArrowDownToLineIcon, MusicIcon, Share2Icon, ShareIcon } from '@lucide/svelte';
    import TrackActions from '../../../../lib/components/shared/track/TrackActions.svelte';
    import TrackShareButton from '../../../../lib/components/shared/track/TrackShareButton.svelte';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../lib/components/ui/tooltip';

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
        <CardFooter class="min-[400px]:grid sm:flex gap-2 grid-cols-3">
            <TrackActions
                track={data.track}
                class="text-sm font-bold text-muted-foreground bg-muted/90 min-[400px]:w-full sm:w-fit w-10"
                labelClass="hidden min-[400px]:inline"
            />
            <Tooltip>
                <TooltipTrigger>
                    {#snippet child({ props })}
                        <Button {...props} variant="secondary" class="text-sm font-bold text-muted-foreground bg-muted/90 min-[400px]:w-full sm:w-fit w-10">
                            <ArrowDownToLineIcon/>
                            <span class="hidden min-[400px]:inline">Download</span>
                        </Button>
                    {/snippet}
                </TooltipTrigger>
                <TooltipContent>Download lyrics to file</TooltipContent>
            </Tooltip>
        </CardFooter>
    </Card>
</div>