<script lang="ts">
    import Button from './ui/button/button.svelte';
    import Clipboard from 'lucide-svelte/icons/clipboard';
    import Copied from 'lucide-svelte/icons/clipboard-check';
    import { selectText } from '../helpers/utils';
    import { clipboard } from 'svelte-legos';
    import isMobile from 'is-mobile';

    export let text: string;
    export let copyTimeout: number = 1000;
    export let select: HTMLDivElement|null = null;

    let board = clipboard({ legacy: isMobile() });
    let copied = false;

    async function copy(): Promise<void> {
        if (copied) return;

        await $board.copy(text);
        copied = true;

        if (select) selectText(select);

        setTimeout(() => {
            copied = false;
        }, copyTimeout);
    }
</script>

{#if $board.isSupported}
    <Button
        {...$$props}
        on:click={copy}
        style={copied ? '--primary: var(--success);' : ''}
    >
        {#if copied}
            <Copied/> Copied
        {:else}
            <Clipboard/> Copy
        {/if}
    </Button>
{/if}