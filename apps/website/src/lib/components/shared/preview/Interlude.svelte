<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { cn } from '$lib/helpers/utils';
    import { Skeleton } from '@/components/ui/skeleton';
    import { settings } from '$lib/helpers/classes/Settings.svelte';

    let {
        ...props
    }: {} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
    {...props}
    class={cn(
        "flex items-center justify-center gap-1.5 py-2 overflow-hidden h-fit transition-all",
        settings.prefersReducedMotion ? "duration-0" : "duration-500",
        props.class
    )}
>
    <Skeleton class="size-4 lg:size-6 rounded-full bg-current/50" />
    <Skeleton class="size-4 lg:size-6 rounded-full delay-500 bg-current/50" />
    <Skeleton class="size-4 lg:size-6 rounded-full delay-1000 bg-current/50" />
</div>