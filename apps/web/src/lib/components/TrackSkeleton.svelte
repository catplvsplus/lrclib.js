<script lang="ts">
    import { cn } from '../helpers/utils';
    import Skeleton from "./ui/skeleton/skeleton.svelte";

    export let animate: boolean = true;
</script>
<div
    {...$$props}
    class={cn(
        "h-24 flex flex-col gap-4 p-4 bg-black/20 dark:bg-muted/20 rounded-md",
        (animate ? "animate-pulse" : ""),
        $$props.class
    )}
>
    <Skeleton class="w-full max-w-80 h-5"/>
    <div class="flex gap-1">
        <Skeleton class="w-20 h-5"/>
        <Skeleton class="w-16 h-5"/>
        <Skeleton class="w-10 h-5"/>
        <Skeleton class="w-24 h-5"/>
    </div>
</div>