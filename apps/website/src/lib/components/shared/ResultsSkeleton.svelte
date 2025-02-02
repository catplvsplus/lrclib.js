<script lang="ts">

    import { cn } from "$lib/helpers/utils";
    import { Skeleton } from '../ui/skeleton';

</script>
<div class="columns-xs pb-5">
    {#each Array(12) as _}
        {@const animationDelay = Math.random() * 1000}
        {@const height = Math.round(Math.random() * 200)}
        <div class="animate-pulse w-full break-inside-avoid-column mb-4" style="animation-delay: {animationDelay}ms">
            <div class="w-full bg-muted-foreground/25 rounded-lg p-4 gap-2 flex flex-col">
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between">
                        <Skeleton class="h-4 w-2/3" />
                        <Skeleton class="h-4 w-10 shrink-0" />
                    </div>
                    <div class="flex gap-2">
                        <Skeleton class="h-3 w-1/5" />
                        <Skeleton class="h-3 w-1/3" />
                    </div>
                </div>
                <div class="flex gap-2">
                    <Skeleton class="h-4 w-12" />
                    <Skeleton class="h-4 w-12" />
                </div>
                <div>
                    <Skeleton style="height: {height}px" class="min-h-20 w-full" />
                </div>
            </div>
        </div>
    {/each}
</div>