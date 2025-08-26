<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { ButtonProps } from '../../ui/button';
    import { fly } from 'svelte/transition';
    import { onClickOutside, PressedKeys } from 'runed';
    import { settings } from '../../../helpers/classes/Settings.svelte';
    import { cn } from '../../../helpers/utils';
    import { DialogState } from '../../../helpers/classes/DialogState.svelte';

    let {
        children
    }: {
        children?: Snippet<[{ props: ButtonProps; }]>;
    } = $props();

    let container: HTMLDivElement|null = $state(null);

    const pressedKeys = new PressedKeys();

    $effect(() => {
        if (fullscreenLyricsDialogState.isOpen !== fullscreenLyricsDialogState.isActive) {
            fullscreenLyricsDialogState.toggle(fullscreenLyricsDialogState.isActive);
        }
    });

    pressedKeys.onKeys('Escape', () => fullscreenLyricsDialogState.isOpen && fullscreenLyricsDialogState.close());
    onClickOutside(() => container, () => fullscreenLyricsDialogState.isOpen && fullscreenLyricsDialogState.close());
</script>

<script module>
    export let fullscreenLyricsDialogState = new DialogState({
        id: 'fullscreen-lyrics'
    });
</script>

{@render children?.({
    props: {
        onclick: () => fullscreenLyricsDialogState.open()
    }
})}

{#if fullscreenLyricsDialogState.isOpen}
    <style>
        html {
            overflow: hidden;
            pointer-events: none;
        }
    </style>
    <div
        class={cn(
            "h-full w-full fixed top-0 left-0 backdrop-blur-3xl pointer-events-auto z-[60]"
        )}
        transition:fly={{ y: window.innerHeight, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
        bind:this={container}
    >
    </div>
{/if}