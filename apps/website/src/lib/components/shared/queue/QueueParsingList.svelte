<script lang="ts">
    import { player } from "$lib/helpers/classes/Player.svelte";
    import { Skeleton } from '@/components/ui/skeleton';
    import { formatBytesString } from '$lib/helpers/utils';

</script>
<div class="grid gap-2">
    {#each player.filesParsing as file (file.name + file.size) }
        <div class="flex gap-2 p-2 bg-card border rounded-xl items-center">
            <Skeleton class="size-10 overflow-hidden rounded-lg shrink-0"/>
            <div class="grid w-full">
                <h3 class="text-sm font-semibold leading-tight truncate">{file.name}</h3>
                <p class="text-xs leading-tight text-muted-foreground truncate">{formatBytesString(file.size)}</p>
            </div>
        </div>
    {/each}
</div>