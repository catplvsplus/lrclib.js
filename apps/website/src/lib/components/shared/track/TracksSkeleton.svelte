<script lang="ts">
    import { Skeleton } from '../../ui/skeleton';

    let { count }: { count: number } = $props();
</script>

{#each { length: count } as _}
    <Skeleton class="h-40 rounded-lg"/>
{/each}