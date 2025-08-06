<script lang="ts">
    import { fly } from "svelte/transition";
    import type { HTMLAttributes } from 'svelte/elements';
    import { settings } from '../../helpers/classes/Settings.svelte';
    import { cn } from '../../helpers/utils';
    import type { Snippet } from 'svelte';

    let {
        children,
        ...props
    }: {
        inY?: number;
        outY?: number;
        inX?: number;
        outX?: number;
        inDuration?: number;
        outDuration?: number;
        inOpacity?: number;
        outOpacity?: number;
        children?: Snippet;
    } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
    {...props}
    class={
        cn(
            "absolute",
            props.class
        )
    }
    in:fly|global={{
        y: props.inY ?? 25,
        x: props.inX,
        opacity: props.inOpacity ?? 0,
        duration: settings.prefersReducedMotion ? 0 : (props.inDuration ?? 300)
    }}
    out:fly|global={{
        y: props.outY ?? -25,
        x: props.outX,
        opacity: props.outOpacity ?? 0,
        duration: settings.prefersReducedMotion ? 0 : (props.outDuration ?? 300)
    }}
>
    {@render children?.()}
</div>