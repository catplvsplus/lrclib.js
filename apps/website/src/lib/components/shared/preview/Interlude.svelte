<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { cn } from '../../../helpers/utils';
    import { Skeleton } from '../../ui/skeleton';
    import { fade } from 'svelte/transition';

    let {
        ...props
    }: {} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
    {...props}
    class={cn("flex items-center justify-center gap-1 py-2", props.class)}
    transition:fade
>
    <Skeleton class="size-4 rounded-full bg-current/50" />
    <Skeleton class="size-4 rounded-full delay-500 bg-current/50" />
    <Skeleton class="size-4 rounded-full delay-1000 bg-current/50" />
</div>