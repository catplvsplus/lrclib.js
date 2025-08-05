<script lang="ts">
    import { mode, toggleMode } from 'mode-watcher';
    import { Button, type ButtonProps } from '../ui/button';
    import { MoonIcon, SunIcon } from '@lucide/svelte';
    import { cn } from '../../helpers/utils';
    import { fly } from 'svelte/transition';
    import { settings } from '../../helpers/classes/Settings.svelte';

    let props: ButtonProps & { [key: string]: any; } = $props();
</script>

<Button {...props} size="icon" onclick={toggleMode} class={cn('relative overflow-hidden', props.class)}>
    {#key mode.current}
        <span
            class="absolute"
            in:fly={{ y: 30, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
            out:fly={{ y: -30, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
        >
            {#if mode.current === 'light'}
                <MoonIcon/>
            {:else}
                <SunIcon/>
            {/if}
        </span>
    {/key}
</Button>