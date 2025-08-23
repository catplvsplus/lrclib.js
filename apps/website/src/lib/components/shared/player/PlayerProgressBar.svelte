<script lang="ts">
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { DateTime } from 'luxon';
    import { useDebounce } from 'runed';

    let currentProgressFormatted = $derived(DateTime.fromSeconds(player.currentTime).toFormat('mm:ss'));
    let durationFormatted = $derived(DateTime.fromSeconds(player.playing?.duration ?? 0).toFormat('mm:ss'));

    let seekProgress: number|null = $state(null);
    let progressBar: HTMLDivElement|null = $state(null);

    const setCurrentTime = useDebounce((time: number) => {
        if (player.player) player.player.currentTime = time;

        seekProgress = null;
    }, 500);

    function seek(e: PointerEvent) {
        const { left, width } = progressBar!.getBoundingClientRect();

        let p = (e.clientX - left) / width;
        if (p < 0) p = 0;
        if (p > 1) p = 1;

        if (!player.player) return;

        const time = p * player.player.duration;

        seekProgress = time / player.player.duration * 100;
        setCurrentTime(time);
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

<div class="flex items-center text-xs font-semibold text-foreground/80 gap-2">
    <span class="shrink-0 w-8 text-start">{currentProgressFormatted}</span>
    <div class="w-full h-2 rounded-full bg-foreground/40 overflow-hidden" onpointerdown={pointerSeek} bind:this={progressBar}>
        <div class="h-full bg-current" style="width: {seekProgress ?? player.progress}%"></div>
    </div>
    <span class="shrink-0 w-8 text-end">{durationFormatted}</span>
</div>