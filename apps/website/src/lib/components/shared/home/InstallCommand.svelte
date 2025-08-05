<script lang="ts">
    import type { TabsRootProps } from 'bits-ui';
    import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
    import TabsContent from '../../ui/tabs/tabs-content.svelte';
    import { cn } from '../../../helpers/utils';
    import { CheckIcon, ClipboardCheckIcon, ClipboardCopyIcon, ClipboardIcon } from '@lucide/svelte';
    import { installCommands } from '../../../helpers/constants';
    import { Button } from '../../ui/button';
    import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
    import { copyText } from '../../../helpers/clipboard';
    import { fly } from 'svelte/transition';
    import { settings } from '../../../helpers/classes/Settings.svelte';

    let { ...props }: TabsRootProps = $props();

    let value = $state('npm');
    let currentValue = $derived(installCommands.find(({ pkgManager }) => pkgManager === value));
    let valueContainer: HTMLElement|undefined = $state();
    let copied = $state(false);

    function copyToClipboard() {
        if (copied) return;

        copied = copyText({
            text: currentValue?.command,
            container: valueContainer,
            selectRequired: true
        });

        console.log(valueContainer);

        if (copied) setTimeout(() => copied = false, 5000);
    }
</script>

{#snippet InstallCommandContainer(data: typeof installCommands[0])}
    <div class="p-1 text-start text-sm flex items-center gap-2 relative">
        <span class="[&_*]:select-all w-full px-2.5">
            {#if data.pkgManager === currentValue?.pkgManager}
                <code bind:this={valueContainer}>{data.command}</code>
            {:else}
                <code>{data.command}</code>
            {/if}
        </span>
        <Tooltip disableCloseOnTriggerClick>
            <TooltipTrigger>
                {#snippet child({ props })}
                    <Button variant="outline" size="icon" class="relative overflow-clip" {...props} onclick={copyToClipboard}>
                        {#key copied}
                            <span
                                class="absolute"
                                in:fly={{ y: 30, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
                                out:fly={{ y: -30, opacity: 1, duration: settings.prefersReducedMotion ? 0 : 300 }}
                            >
                                {#if copied}
                                    <CheckIcon class="text-green-500"/>
                                {:else}
                                    <ClipboardIcon/>
                                {/if}
                            </span>
                        {/key}
                    </Button>
                {/snippet}
            </TooltipTrigger>
            <TooltipContent>
                {#if copied}
                    <span class="text-green-500">Copied</span>
                {:else}
                    Copy to clipboard
                {/if}
            </TooltipContent>
        </Tooltip>
    </div>
{/snippet}

<Tabs bind:value {...props} class={cn("w-full max-w-96 bg-card rounded-xl border-primary/50 dark:border-primary border-2 shadow-primary/20 shadow-lg", props.class)}>
    <TabsList class="w-full overflow-auto h-fit justify-start bg-transparent rounded-b-none border-b">
        {#each installCommands as { pkgManager, icon }}
            <TabsTrigger value={pkgManager} class="flex items-center gap-2 py-2 data-[state=active]:bg-black/5 shadow-transparent">
                {#if icon}
                    {@const Icon = icon}
                    <Icon/>
                {/if}
                <span>{pkgManager}</span>
            </TabsTrigger>
        {/each}
    </TabsList>
    {#each installCommands as data}
        <TabsContent value={data.pkgManager}>
            {@render InstallCommandContainer(data)}
        </TabsContent>
    {/each}
</Tabs>