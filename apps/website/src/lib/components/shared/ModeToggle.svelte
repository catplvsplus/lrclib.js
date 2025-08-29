<script lang="ts">
    import { mode, toggleMode } from 'mode-watcher';
    import { Button, type ButtonProps } from '../ui/button';
    import { MoonIcon, SunIcon } from '@lucide/svelte';
    import { cn } from '../../helpers/utils';
    import FlyInOut from './FlyInOut.svelte';

    let props: ButtonProps & { [key: string]: any; } = $props();
</script>

<Button {...props} size="icon" onclick={toggleMode} class={cn('relative overflow-hidden', props.class)}>
    {#key mode.current}
        <FlyInOut
            inY={30}
            outY={-30}
        >
            {#if mode.current === 'light'}
                <MoonIcon/>
            {:else}
                <SunIcon/>
            {/if}
        </FlyInOut>
    {/key}
</Button>