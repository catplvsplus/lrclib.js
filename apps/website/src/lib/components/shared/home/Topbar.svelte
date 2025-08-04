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
    import ModeToggle from '../ModeToggle.svelte';
    import { settings } from '../../../helpers/classes/Settings.svelte';

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

<header
    class={cn(
        "fixed top-0 z-50 w-full h-16 flex justify-center bg-background border-b",
        !settings.prefersReducedTransparency && "backdrop-blur-sm backdrop-saturate-150 bg-background/60",
    )}
>
    <div class="container h-full flex items-center justify-between py-2 px-4">
        <Button class="sm:hidden" variant="ghost" size="icon" onclick={() => menuState.toggle()}>
            <EqualIcon class="size-6!"/>
        </Button>
        <a href={resolve("/(home)")} class="flex items-center gap-1 text-xl font-bold tracking-wide">
            <Logo class="size-7"/>
            <span>Lrclib<span class="text-primary">.js</span></span>
        </a>
        <nav class="links items-center gap-4 text-sm sm:flex hidden font-medium">
            {@render Links()}
        </nav>
        <div class="flex items-center gap-2">
            <ModeSwitcher class="hidden sm:flex"/>
            <ModeToggle class="sm:hidden" variant="outline"/>
        </div>
    </div>
</header>
<ResponsiveDialog
    dialogState={menuState}
    drawerDirection="left"
    drawerContentProps={{
        class: cn(
            "w-full! max-w-75",
            !settings.prefersReducedTransparency && "backdrop-blur-sm backdrop-saturate-150 bg-background/80"
        )
    }}
>
    {#snippet title({ type })}
        <span class:hidden={type === 'drawer'}>Quick links</span>
        <div class="absolute top-0 left-0 mt-4 ml-4 flex gap-2 items-center" class:hidden={type === 'dialog'}>
            <Button variant="outline" size="icon" onclick={() => menuState.close()}>
                <XIcon class="size-6!"/>
            </Button>
            <span class="text-base font-bold">Quick links</span>
        </div>
    {/snippet}
    {#snippet description({ type })}
        <span class:hidden={type === 'drawer'}>Navigate other parts of lrclib.js</span>
    {/snippet}
    {#snippet content({ type })}
        <div class="grid sm:grid-cols-2 gap-2 p-{type === 'drawer' ? '4' : '0'}" class:pt-6={type === 'drawer'}>
            {@render Links({
                className: buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    class: cn(
                        "justify-start bg-transparent border border-muted h-12 text-sm rounded-lg bg-muted/50"
                    )
                }),
                showIcons: true
            })}
        </div>
    {/snippet}
    {#snippet footer({ type })}
        <Button variant="secondary" size="lg" class="w-full {type === 'drawer' && 'hidden'}" onclick={() => menuState.close()}>Close</Button>
    {/snippet}
</ResponsiveDialog>