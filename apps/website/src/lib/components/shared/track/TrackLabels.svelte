<script lang="ts">
    import type { APIResponse } from 'lrclib.js';
    import { Badge } from '../../ui/badge';
    import { formatDurationString } from '../../../helpers/utils';
    import { ClockIcon, GuitarIcon, LetterTextIcon, ListMusicIcon, MicVocalIcon, Music2Icon, TextIcon } from '@lucide/svelte';

    let {
        track
    }: {
        track: APIResponse.Get.TrackSignature;
    } = $props();
</script>

<div class="flex gap-1">
    <Badge class="bg-green-500/10 text-green-500 font-semibold">
        <ClockIcon class="size-3.5!"/>
        {formatDurationString(track.duration * 1000)}
    </Badge>
    {#if track.instrumental}
        <Badge class="bg-yellow-500/10 text-yellow-500 font-semibold">
            <Music2Icon class="size-3.5!"/>
            Instrumental
        </Badge>
    {:else if !track.syncedLyrics}
        <Badge class="bg-blue-500/10 text-blue-500 font-semibold">
            <LetterTextIcon class="size-3.5!"/>
            Unsynced
        </Badge>
    {:else}
        <Badge class="bg-primary/10 text-primary font-semibold">
            <MicVocalIcon class="size-3.5!"/>
            Synced
        </Badge>
    {/if}
</div>