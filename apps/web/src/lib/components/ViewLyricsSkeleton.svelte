<script lang="ts">
    import TrackSkeleton from './TrackSkeleton.svelte';
    import { Skeleton } from "./ui/skeleton";
</script>
<div class="flex flex-col">
    <TrackSkeleton animate={false} class="bg-transparent dark:bg-transparent"/>
    <div class="flex gap-1 mb-2">
        <Skeleton class="w-1/2 h-10"/>
        <Skeleton class="w-1/2 h-10"/>
    </div>
    <Skeleton class="w-full min-h-96"/>
</div>