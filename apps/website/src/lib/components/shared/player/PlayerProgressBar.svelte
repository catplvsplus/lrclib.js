<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import RangeSlider from 'svelte-range-slider-pips';
    import { DateTime } from 'luxon';

    let currentProgressFormatted = $derived(player.playing ? DateTime.fromSeconds(player.currentTime).toFormat('mm:ss') : '---:--');
    let durationFormatted = $derived(player.playing ? DateTime.fromSeconds(player.playing?.duration ?? 0).toFormat('mm:ss') : '---:--');
</script>

<div class="flex items-center text-xs font-semibold text-foreground/80 gap-2 flex-col lg:flex-row">
    <span class="shrink-0 w-8 text-start hidden lg:block">{currentProgressFormatted}</span>
    <div class="w-full">
        <RangeSlider
            on:start={() => {
                player.pause();
            }}
            on:stop={() => {
                player.play();
            }}
            on:change={(e) => {
                player.player!.currentTime = e.detail.value;
            }}
            bind:value={player.currentTime}
            step={0.5}
            range={'min'}
            max={player.playing?.duration ?? 0}
            springValues={{ stiffness: 0.3, damping: 0.9 }}
            disabled={!player.player || !player.playing}
        />
    </div>
    <span class="shrink-0 w-8 text-end hidden lg:block">{durationFormatted}</span>
    <div class="flex justify-between w-full lg:hidden">
        <span class="shrink-0 w-8 text-start">{currentProgressFormatted}</span>
        <span class="shrink-0 w-8 text-end">{durationFormatted}</span>
    </div>
</div>