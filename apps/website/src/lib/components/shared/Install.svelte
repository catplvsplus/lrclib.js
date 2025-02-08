<script lang="ts">
    import * as Tabs from '$lib/components/ui/tabs/index';
    import { SiBun, SiDeno, SiNpm, SiPnpm, SiYarn } from '@icons-pack/svelte-simple-icons';
    import { cn, copyText } from '../../helpers/utils';
    import { Button } from '../ui/button';
    import { Clipboard } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';

    let props = $props();

    function copyCommand(text: string, id: string) {
        const copied = copyText({
            text,
            container: document.getElementById(id) ?? undefined
        });

        if (!copied) return;
        toast.success('Command copied to clipboard!');
    }
</script>

{#snippet installCodeblock(command: string)}
    <div class="border rounded-lg p-5 relative overflow-auto pr-12">
        <code id="command-{command.split(' ')[0]}">{command}</code>
        <Button variant="outline" size="icon" title="Copy" class="absolute right-3 top-3" onclick={() => copyCommand(command, `command-${command.split(' ')[0]}`)}>
            <Clipboard/>
        </Button>
    </div>
{/snippet}

<Tabs.Root value="npm" {...props} class={cn("w-full max-w-[800px]", props.class)}>
    <Tabs.List class="overflow-auto max-w-full justify-normal">
        <Tabs.Trigger value="npm"><SiNpm size={15}/>&nbsp;NPM</Tabs.Trigger>
        <Tabs.Trigger value="yarn"><SiYarn size={15}/>&nbsp;Yarn</Tabs.Trigger>
        <Tabs.Trigger value="pnpm"><SiPnpm size={15}/>&nbsp;Pnpm</Tabs.Trigger>
        <Tabs.Trigger value="bun"><SiBun size={15}/>&nbsp;Bun</Tabs.Trigger>
        <Tabs.Trigger value="deno"><SiDeno size={15}/>&nbsp;Deno</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="npm">{@render installCodeblock('npm i lrclib.js')}</Tabs.Content>
    <Tabs.Content value="yarn">{@render installCodeblock('yarn add lrclib.js')}</Tabs.Content>
    <Tabs.Content value="pnpm">{@render installCodeblock('pnpm add lrclib.js')}</Tabs.Content>
    <Tabs.Content value="bun">{@render installCodeblock('bun add lrclib.js')}</Tabs.Content>
    <Tabs.Content value="deno">{@render installCodeblock('deno install lrclib.js')}</Tabs.Content>
</Tabs.Root>