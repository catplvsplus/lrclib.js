<script lang="ts">
    import { isBlurAllowed } from '$lib/helpers/stores';
    import { onMount } from 'svelte';

    let progress = $state(0);

    setTimeout(() => {
        progress = 50;

        setTimeout(() => {
            progress = 70;

            setTimeout(() => {
                progress = 90;
            }, 500);
        }, 500);
    }, 500);
</script>

<div class="h-screen w-screen flex justify-center items-center fixed top-0 left-0 z-50 bg-background/20 {$isBlurAllowed ? 'backdrop-blur-sm' : ''}">
    <div class="progress h-1.5 w-full bg-border/60 absolute top-0 left-0">
        <div class="h-full bg-primary/90 duration-300 transition-all" style="width: {progress}%"></div>
    </div>
</div>