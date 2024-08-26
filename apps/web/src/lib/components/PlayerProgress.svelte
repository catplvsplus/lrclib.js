<script lang="ts">
    import { DateTime } from 'luxon';

    export let duration: number = 0;
    export let currentTime: number = 0;
    export let percent: number = 0;

    $: currentTime, percent = (currentTime / duration) * 100;

    let target: HTMLDivElement;

    function pointerSeek(e: PointerEvent) {
        function seek(e: PointerEvent) {
            const { left, width } = target.getBoundingClientRect();

            let p = (e.clientX - left) / width;
            if (p < 0) p = 0;
            if (p > 1) p = 1;

            currentTime = p * duration;
        }

        seek(e);

        window.addEventListener('pointermove', seek);
        window.addEventListener('pointerup', () => {
            window.removeEventListener('pointermove', seek);
        }, { once: true });
    }
</script>

<div class="flex gap-2 text-foreground dark:text-muted-foreground items-center">
    <span>{DateTime.fromSeconds(currentTime).toFormat('mm:ss')}</span>
    <div class="w-full h-2 rounded bg-muted-foreground/80 dark:bg-muted/80 overflow-hidden" on:pointerdown|preventDefault={pointerSeek} bind:this={target}>
        <span class="block bg-black dark:bg-white h-2" style="width: {percent}%"></span>
    </div>
    <span>{DateTime.fromSeconds(duration).toFormat('mm:ss')}</span>
</div>