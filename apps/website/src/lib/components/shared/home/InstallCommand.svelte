<script lang="ts">
    import type { TabsRootProps } from 'bits-ui';
    import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
    import TabsContent from '../../ui/tabs/tabs-content.svelte';
    import { cn } from '../../../helpers/utils';
    import { ClipboardCopyIcon } from '@lucide/svelte';
    import { installCommands } from '../../../helpers/constants';
    import { Button } from '../../ui/button';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
    import { copyText } from '../../../helpers/clipboard';

    let { ...props }: TabsRootProps = $props();

    let valueContainer: HTMLElement|undefined = undefined;
    let value = $state('npm');
    let currentValue = $derived(installCommands.find(({ pkgManager }) => pkgManager === value));

    function copyToClipboard() {
        copyText({
            text: currentValue?.command,
            container: valueContainer,
            selectRequired: true
        });
    }
</script>

{#snippet InstallCommandContainer(text: string)}
    <div class="p-1 text-start text-sm flex items-center gap-2 relative">
        <code class="select-all w-full px-2.5" bind:this={valueContainer}>{text}</code>
        <Tooltip>
            <TooltipTrigger>
                {#snippet child({ props })}
                    <Button variant="outline" size="icon" {...props} onclick={copyToClipboard}>
                        <ClipboardCopyIcon/>
                    </Button>
                {/snippet}
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>
    </div>
{/snippet}

<Tabs bind:value {...props} class={cn("w-full max-w-96 bg-card rounded-xl border-primary/50 dark:border-primary border-2 shadow-primary/20 shadow-lg", props.class)}>
    <TabsList class="w-full overflow-auto justify-start bg-transparent rounded-b-none border-b">
        {#each installCommands as { pkgManager, icon }}
            <TabsTrigger value={pkgManager} class="flex items-center gap-2 data-[state=active]:bg-black/5 shadow-transparent">
                {#if icon}
                    {@const Icon = icon}
                    <Icon/>
                {/if}
                <span>{pkgManager}</span>
            </TabsTrigger>
        {/each}
    </TabsList>
    {#each installCommands as { pkgManager, command }}
        <TabsContent value={pkgManager}>
            {@render InstallCommandContainer(command)}
        </TabsContent>
    {/each}
</Tabs>