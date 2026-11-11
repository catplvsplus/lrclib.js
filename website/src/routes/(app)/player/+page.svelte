<script lang="ts">
    import PlayerCard from '#lib/components/app/player/PlayerCard.svelte';
    import { Input } from '#lib/components/ui/input/index.js';
    import { ACCEPTED_AUDIO_TYPES } from '#lib/helpers/constants.js';
    import { playerContext } from '#lib/helpers/contexts.js';

    const player = playerContext.get();
</script>

<div class="grid @2xl:grid-cols-2 @3xl:grid-cols-3 w-full min-h-full sm:pl-0 px-0 sm:px-4 pb-4">
    <div class="p-2">
        <PlayerCard/>
    </div>
    <div class="p-2">
        <Input
            multiple
            type="file"
            accept={ACCEPTED_AUDIO_TYPES.join(',')}
            onchange={async (e) => {
                const files = Array.from(e.currentTarget.files ?? []);
                if (!files || !files.length) return;

                await player.playFiles(files);
            }}
        />
    </div>
</div>