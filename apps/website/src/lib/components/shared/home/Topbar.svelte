<script lang="ts">
    import { resolve } from "$app/paths";
    import { EqualIcon, FileIcon, GitBranchIcon, HouseIcon, UsersIcon, XIcon } from '@lucide/svelte';
    import Logo from '../../svg/logo.svelte';
    import { Button, buttonVariants } from '../../ui/button';
    import ModeSwitcher from '../ModeSwitcher.svelte';
    import { links } from '../../../helpers/constants';
    import ResponsiveDialog from '../ResponsiveDialog.svelte';
    import { DialogState } from '../../../helpers/classes/DialogState.svelte';
    import { cn } from '../../../helpers/utils';

    let menuState = new DialogState({ id: 'menu' });
</script>

{#snippet Links({ className, showIcons }: { className?: string; showIcons?: boolean; } = {})}
    <a class={className} href={resolve("/(home)")} onclick={() => menuState.close()}>
        <HouseIcon class={!showIcons ? 'hidden' : ''}/>
        Home
    </a>
    <a class={className} href={resolve("/docs")} onclick={() => menuState.close()}>
        <FileIcon class={!showIcons ? 'hidden' : ''}/>
        Docs
    </a>
    <a class={className} href={links.github} target="_blank" onclick={() => menuState.close()}>
        <GitBranchIcon class={!showIcons ? 'hidden' : ''}/>
        Contribute
    </a>
    <a class={className} href={links.contact} target="_blank" onclick={() => menuState.close()}>
        <UsersIcon class={!showIcons ? 'hidden' : ''}/>
        Contact
    </a>
{/snippet}

<header class="fixed top-0 z-50 w-full h-16 flex justify-center bg-background border-b">
    <div class="container h-full flex items-center justify-between py-2 px-4">
        <a href={resolve("/(home)")} class="flex items-center gap-1 text-xl font-bold tracking-wide">
            <Logo class="size-7"/>
            <span>Lrclib<span class="text-primary">.js</span></span>
        </a>
        <nav class="links items-center gap-4 text-sm sm:flex hidden font-medium">
            {@render Links()}
        </nav>
        <div class="flex items-center gap-2">
            <ModeSwitcher class="hidden sm:flex"/>
            <Button class="sm:hidden" variant="ghost" size="icon" onclick={() => menuState.toggle()}>
                <EqualIcon class="size-6!"/>
            </Button>
        </div>
    </div>
</header>
<ResponsiveDialog dialogState={menuState} drawerDirection="right" drawerContentProps={{ class: "w-full! max-w-75" }}>
    {#snippet title({ type })}
        Quick links
        <Button variant="ghost" size="icon" class="absolute top-0 right-0 mt-4 mr-4 {type === 'dialog' && 'hidden'}" onclick={() => menuState.close()}>
            <XIcon class="size-6!"/>
        </Button>
    {/snippet}
    {#snippet description()}
        Navigate to other parts of lrclib.js
    {/snippet}
    {#snippet content({ type })}
        <div class="grid sm:grid-cols-2 gap-2 p-2">
            {@render Links({
                className: buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    class: cn(
                        "justify-start bg-transparent border border-muted h-12 text-sm rounded-lg"
                    )
                }),
                showIcons: true
            })}
            <ModeSwitcher labels={true} class="w-full h-10 {type === 'dialog' && 'hidden'}"/>
        </div>
    {/snippet}
    {#snippet footer({ type })}
        <Button variant="secondary" size="lg" class="w-full {type === 'drawer' && 'hidden'}" onclick={() => menuState.close()}>Close</Button>
    {/snippet}
</ResponsiveDialog>