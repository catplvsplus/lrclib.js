<script lang="ts">
    import { Card, CardContent } from "@/components/ui/card";
    import { AspectRatio as div } from '../../ui/aspect-ratio';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { resolve } from '$app/paths';

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<Card class="h-fit">
    <CardContent class="flex gap-2">
        <div class="size-60 shrink-0 overflow-hidden rounded-lg">
            <img src={coverURL} alt="" class="size-full object-cover">
        </div>
    </CardContent>
</Card>