<script lang="ts">
    import { useClipboard } from '@ariefsn/svelte-use';
    import { Button, type ButtonProps } from '$lib/components/ui/button/index.js';
    import { CheckIcon, ClipboardIcon } from '@lucide/svelte';
    import FlyInOut from './FlyInOut.svelte';

    let { text, ...props }: {
        text: string;
    } & ButtonProps = $props();

    const clipboard = useClipboard();
</script>

<Button
    {...props}
    class={[
        "rounded-xl overflow-hidden",
        clipboard.copied() && "text-green-500! bg-green-500/10! border-green-500/20!",
        props.class
    ]}
    onclick={() => clipboard.copy(text)}
>
    {#if clipboard.copied()}
        <FlyInOut class="flex gap-1 items-center">
            <CheckIcon/>
            <span>Copied</span>
        </FlyInOut>
    {:else}
        <FlyInOut class="flex gap-1 items-center">
            <ClipboardIcon/>
            <span>Copy</span>
        </FlyInOut>
    {/if}
    <ClipboardIcon class="opacity-0"/>
    <span class="opacity-0">{clipboard.copied() ? 'Copied' : 'Copy'}</span>
</Button>