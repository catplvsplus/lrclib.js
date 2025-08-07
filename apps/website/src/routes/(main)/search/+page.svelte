<script lang="ts">
    import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
    import SearchInput from '../../../lib/components/shared/home/SearchInput.svelte';

    let { data } = $props();

    let tracks = $derived(data.tracks);
</script>

<div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    <SearchInput/>
    {#each tracks ?? [] as track}
        <Card>
            <CardHeader>
                <CardTitle>{track.trackName}</CardTitle>
                <CardDescription>{track.artistName} - {track.albumName}</CardDescription>
            </CardHeader>
        </Card>
    {/each}
</div>