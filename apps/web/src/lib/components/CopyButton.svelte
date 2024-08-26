<script lang="ts">
    import Button from './ui/button/button.svelte';
    import Clipboard from 'lucide-svelte/icons/clipboard';
    import Copied from 'lucide-svelte/icons/clipboard-check';

    export let text: string;
    export let copyTimeout: number = 1000;
    export let select: HTMLElement|null = null;

    let copied = false;

    async function copy(): Promise<void> {
        if (copied) return;

        await navigator.clipboard.writeText(text);
        copied = true;

        setTimeout(() => {
            copied = false;
        }, copyTimeout);
    }
</script>

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