<script lang="ts">
    import { Button, type ButtonProps } from '$lib/components/ui/button/index.js';
    import { CheckIcon, ClipboardIcon } from '@lucide/svelte';
    import FlyInOut from './FlyInOut.svelte';
    import { Clipboard } from '../../classes/Clipboard.svelte';

    let {
        text,
        clipboard = new Clipboard(),
        copied = $bindable(clipboard.copied),
        ...props
    }: {
        text: string;
        clipboard?: Clipboard;
        copied?: boolean;
    } & ButtonProps = $props();
</script>

<Button
    {...props}
    class={[
        "rounded-xl overflow-hidden relative",
        copied && "text-green-500! bg-green-500/10! border-green-500/20!",
        props.class
    ]}
    onclick={() => clipboard.copy(text)}
>
    {#if copied}
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
    <span class="opacity-0">{copied ? 'Copied' : 'Copy'}</span>
</Button>