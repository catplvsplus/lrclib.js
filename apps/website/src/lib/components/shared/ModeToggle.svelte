<script lang="ts">
    import { mode, toggleMode } from 'mode-watcher';
    import { Button, type ButtonVariant } from "../ui/button";
    import { Moon, Sun } from "@lucide/svelte";
    import { cn } from '../../helpers/utils';
    import { fade } from 'svelte/transition';

    let { variant, ...props }: { variant?: ButtonVariant; [key: string]: any; } = $props();
</script>
<Button {variant} size="icon" onclick={toggleMode} title="Go to {mode.current === 'dark' ? 'light' : 'dark'} mode" class={cn('relative', props.class)}>
    {#key mode.current}
        <span class="absolute" transition:fade>
            {#if mode.current === 'dark'}
                <Sun/>
            {:else}
                <Moon/>
            {/if}
        </span>
    {/key}
</Button>