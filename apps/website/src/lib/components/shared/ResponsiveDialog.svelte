<script lang="ts">
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog/index.js';
    import { Drawer, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
    import { DrawerContent } from '$lib/components/ui/drawer/index.js';
    import { MediaQuery } from 'svelte/reactivity';
    import type { Snippet } from 'svelte';

    let {
        content,
        footer,
        title,
        description,
        drawerDirection = 'bottom',
        minWidth = `639px`,
        open = $bindable(),
        ...props
    }: {
        content?: Snippet<[{ type: 'dialog'|'drawer' }]>;
        footer?: Snippet<[{ type: 'dialog'|'drawer' }]>;
        title?: Snippet<[{ type: 'dialog'|'drawer' }]>;
        description?: Snippet<[{ type: 'dialog'|'drawer' }]>;
        drawerDirection?: 'left'|'right'|'top'|'bottom';
        minWidth?: string;
        open: boolean;
        [key: string]: any;
    } = $props();

    let isDesktop: MediaQuery|null = $state(null);

    $effect(() => {
        isDesktop = new MediaQuery(`(min-width: ${minWidth})`);
    })
</script>

{#if isDesktop?.current}
    <Dialog bind:open>
        <DialogContent {...props}>
            {#if title || description}
                <DialogHeader class="text-start">
                    {#if title}<DialogTitle>{@render title({ type: 'dialog' })}</DialogTitle>{/if}
                    {#if description}<DialogDescription>{@render description({ type: 'dialog' })}</DialogDescription>{/if}
                </DialogHeader>
            {/if}
            {@render content?.({ type: 'dialog' })}
            {#if footer}
                <DialogFooter>{@render footer({ type: 'dialog' })}</DialogFooter>
            {/if}
        </DialogContent>
    </Dialog>
{:else}
    <Drawer bind:open direction={drawerDirection}>
        <DrawerContent {...props}>
            {#if title || description}
                <DrawerHeader>
                    {#if title}<DrawerTitle>{@render title({ type: 'drawer' })}</DrawerTitle>{/if}
                    {#if description}<DrawerDescription>{@render description({ type: 'drawer' })}</DrawerDescription>{/if}
                </DrawerHeader>
            {/if}
            {@render content?.({ type: 'drawer' })}
            {#if footer}
                <DrawerFooter>{@render footer({ type: 'drawer' })}</DrawerFooter>
            {/if}
        </DrawerContent>
    </Drawer>
{/if}