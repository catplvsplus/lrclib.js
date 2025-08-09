<script lang="ts">
    import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import TrackCard from '../../../../lib/components/shared/track/TrackCard.svelte';
    import { Card, CardContent } from '../../../../lib/components/ui/card';

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
    <TrackCard track={data.track}></TrackCard>
    <Card>
        <CardContent>
            <pre>{data.track.syncedLyrics}</pre>
        </CardContent>
    </Card>
</div>