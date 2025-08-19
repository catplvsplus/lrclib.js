<script lang="ts">
    import { onDestroy, onMount, untrack } from 'svelte';
    import { createSwapy, utils, type SlotItemMapArray, type Swapy } from 'swapy';
    import { player } from '$lib/helpers/classes/Player.svelte';
    import { resolve } from '$app/paths';

    let container = $state<HTMLDivElement|null>(null);
    let swapy: Swapy|null = null;

    let slotItemsMap = $state(utils.initSlotItemMap(player.queue, 'id'));
    let slottedItems = $derived(utils.toSlottedItems(player.queue, 'id', slotItemsMap));

    function setSlotItemsMap(value: SlotItemMapArray) {
        slotItemsMap = value;
    }

    $effect(() => {
        utils.dynamicSwapy(
            swapy,
            player.queue,
            'id',
            untrack(() => slotItemsMap),
            setSlotItemsMap
        )
    });

    $effect(() => {
        player.queue;

        swapy?.update();
    })

    onMount(() => {
        if (!container) return;

        swapy = createSwapy(container, {
            manualSwap: true,
            dragAxis: 'y'
        });

        swapy.onSwapStart(() => {
            console.log('Swap started');
        });

        swapy.onSwap(event => {
            console.log('Swap', event);
            requestAnimationFrame(() => {
                slotItemsMap = event.newSlotItemMap.asArray;
            });
        });

        swapy.onSwapEnd(() => {
            console.log('Swap ended');
            player.queue = slottedItems.map(({ item }) => item).filter(i => !!i);
        });
    });

    onDestroy(() => {
        swapy?.destroy();
    });

    $inspect(player.queue);
</script>

<div bind:this={container}>
    <div class="grid gap-2">
        {#each slottedItems as { slotId, itemId, item }}
            {#key slotId}
                <div data-swapy-slot={slotId}>
                    {#key itemId}
                        {@const coverURL = item?.coverImageURL ?? `${resolve('/')}cover.png`}
                        <div class="flex gap-2 p-2 bg-card border rounded-xl items-center" data-swapy-item={itemId}>
                            <div class="size-10 overflow-hidden rounded-lg shrink-0">
                                <img src={coverURL} class="size-full object-cover" alt="">
                            </div>
                            <div class="grid">
                                <h3 class="text-sm font-semibold leading-tight truncate">{item?.title}</h3>
                                <p class="text-xs leading-tight text-muted-foreground">
                                    {[item?.artist, item?.album].filter(Boolean).join(' • ')}
                                </p>
                            </div>
                        </div>
                    {/key}
                </div>
            {/key}
        {/each}
    </div>
</div>