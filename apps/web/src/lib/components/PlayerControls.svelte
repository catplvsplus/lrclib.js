<script lang="ts">
    import Button from './ui/button/button.svelte';
    import Play from 'lucide-svelte/icons/play';
    import Pause from 'lucide-svelte/icons/pause';
    import Unmuted from 'lucide-svelte/icons/volume-2';
    import Muted from 'lucide-svelte/icons/volume-off';
    import Unloop from 'lucide-svelte/icons/repeat';
    import Loop from 'lucide-svelte/icons/repeat-1';
    import { cn } from '../helpers/utils';

    export let loop: boolean;
    export let paused: boolean;
    export let muted: boolean;
</script>

<div {...$$props} class={cn("flex items-center gap-4", $$props.class)}>
    <Button
        on:click={() => loop = !loop}
        class={cn(
            "h-12 w-12 p-0 rounded-full",
            !loop ? "bg-muted-foreground/50 hover:bg-muted-foreground/80 dark:bg-background/20 dark:hover:bg-background/40" : "!bg-primary/10 text-primary"
        )}
    >
        {#if loop}<Loop/>{:else}<Unloop/>{/if}
    </Button>
    <Button
        on:click={() => paused = !paused}
        class={cn(
            "h-16 w-16 p-0 rounded-full bg-muted-foreground/80 hover:bg-muted-foreground/90 dark:bg-background/20 dark:hover:bg-background/40"
        )}
    >
        {#if paused}<Play size="30"/>{:else}<Pause size="30"/>{/if}
    </Button>
    <Button
        on:click={() => muted = !muted}
        class={cn(
            "h-12 w-12 p-0 rounded-full",
            !muted ? "bg-muted-foreground/50 hover:bg-muted-foreground/80 dark:bg-background/20 dark:hover:bg-background/40" : "!bg-primary/10 text-primary"
        )}
    >
        {#if muted}<Muted/>{:else}<Unmuted/>{/if}
    </Button>
</div>