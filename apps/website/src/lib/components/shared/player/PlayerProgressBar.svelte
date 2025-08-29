<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { DateTime } from 'luxon';

    let currentProgressFormatted = $derived(player.playing ? DateTime.fromSeconds(player.currentTime).toFormat('mm:ss') : '---:--');
    let durationFormatted = $derived(player.playing ? DateTime.fromSeconds(player.playing?.duration ?? 0).toFormat('mm:ss') : '---:--');

    let progressBar: HTMLDivElement|null = $state(null);

    function seek(e: PointerEvent) {
        const { left, width } = progressBar!.getBoundingClientRect();

        let p = (e.clientX - left) / width;
        if (p < 0) p = 0;
        if (p > 1) p = 1;

        if (!player.player) return;

        const time = p * player.player.duration;

        player.player.currentTime = time;
    }

    function pointerSeek(event: PointerEvent) {
        event.preventDefault();

        if (!progressBar) return;

        seek(event);

        window.addEventListener('pointermove', seek);
        window.addEventListener('pointerup', () => {
            window.removeEventListener('pointermove', seek);
        }, {
            once: true
        });
    }
</script>

<div class="flex items-center text-xs font-semibold text-foreground/80 gap-2 flex-col lg:flex-row">
    <span class="shrink-0 w-8 text-start hidden lg:block">{currentProgressFormatted}</span>
    <div class="w-full h-2 rounded-full bg-current/25 overflow-hidden" onpointerdown={pointerSeek} bind:this={progressBar}>
        <div class="h-full w-0 bg-current" style="width: {player.progress}%"></div>
    </div>
    <span class="shrink-0 w-8 text-end hidden lg:block">{durationFormatted}</span>
    <div class="flex justify-between w-full lg:hidden">
        <span class="shrink-0 w-8 text-start">{currentProgressFormatted}</span>
        <span class="shrink-0 w-8 text-end">{durationFormatted}</span>
    </div>
</div>