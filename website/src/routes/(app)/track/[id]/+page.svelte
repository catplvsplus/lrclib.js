<script lang="ts">
    import TrackCard from '$lib/components/app/TrackCard.svelte';

    let { data } = $props();

    let track = $derived(data.track);
</script>

<div class="grid gap-2 sm:pl-0 px-4 pb-4">
    <TrackCard {track}/>
    <section>
        <h2 class="text-lg font-semibold">Lyrics</h2>
        <pre class="whitespace-pre-wrap text-sm text-muted-foreground">{track.plainLyrics}</pre>
    </section>
</div>