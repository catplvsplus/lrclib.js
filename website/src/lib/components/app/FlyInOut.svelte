<script lang="ts">
    import { fly } from "svelte/transition";
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Snippet } from 'svelte';
    import { cn } from 'cn';
    import { prefersReducedMotion } from 'svelte/motion';

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
    in:fly={{
        y: props.inY ?? 25,
        x: props.inX,
        opacity: props.inOpacity ?? 0,
        duration: prefersReducedMotion.current ? 0 : (props.inDuration ?? 300)
    }}
    out:fly={{
        y: props.outY ?? -25,
        x: props.outX,
        opacity: props.outOpacity ?? 0,
        duration: prefersReducedMotion.current ? 0 : (props.outDuration ?? 300)
    }}
>
    {@render children?.()}
</div>