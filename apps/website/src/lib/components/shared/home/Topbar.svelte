<script lang="ts">
    import { base, resolve } from "$app/paths";
    import { FileIcon, GitBranchIcon, Github, HouseIcon, Menu, MenuIcon, PhoneCallIcon } from '@lucide/svelte';
    import Logo from '../../svg/logo.svelte';
    import { Button, buttonVariants } from '../../ui/button';
    import ModeToggle from '../ModeToggle.svelte';
    import { links } from '../../../helpers/constants';
    import ResponsiveDialog from '../ResponsiveDialog.svelte';

    let menuOpen = $state(false);
</script>

{#snippet Links({ className, showIcons }: { className?: string; showIcons?: boolean; } = {})}
    <a class={className} href={resolve("/(home)")} onclick={() => menuOpen = false}>
        <HouseIcon class={!showIcons ? 'hidden' : ''}/>
        Home
    </a>
    <a class={className} href={resolve("/docs")} onclick={() => menuOpen = false}>
        <FileIcon class={!showIcons ? 'hidden' : ''}/>
        Docs
    </a>
    <a class={className} href={links.github} target="_blank" onclick={() => menuOpen = false}>
        <GitBranchIcon class={!showIcons ? 'hidden' : ''}/>
        Contribute
    </a>
    <a class={className} href={links.contact} target="_blank" onclick={() => menuOpen = false}>
        <PhoneCallIcon class={!showIcons ? 'hidden' : ''}/>
        Contact
    </a>
{/snippet}

<header class="fixed top-0 z-50 w-full h-16 flex justify-center bg-background border-b">
    <div class="container h-full flex items-center justify-between py-2 px-4">
        <a href={resolve("/(home)")} class="flex items-center gap-1 text-xl font-medium">
            <Logo class="size-7"/>
            <span>lrclib<span class="text-primary">.js</span></span>
        </a>
        <nav class="links items-center gap-4 text-sm sm:flex hidden font-medium">
            {@render Links()}
        </nav>
        <div class="flex items-center gap-2">
            <ModeToggle variant="outline"/>
            <Button class="sm:hidden" variant="outline" size="icon" onclick={() => menuOpen = !menuOpen}>
                <MenuIcon/>
            </Button>
        </div>
    </div>
</header>
<ResponsiveDialog bind:open={menuOpen}>
    {#snippet title()}
        Quick links
    {/snippet}
    {#snippet description()}
        Navigate to other parts of lrclib.js
    {/snippet}
    {#snippet content()}
        <div class="grid grid-cols-2 gap-2 p-2">
            {@render Links({
                className: buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    class: "justify-start bg-transparent border border-muted h-12 text-sm"
                }),
                showIcons: true
            })}
        </div>
    {/snippet}
    {#snippet footer()}
        <Button variant="secondary" size="lg" class="w-full" onclick={() => menuOpen = false}>Close</Button>
    {/snippet}
</ResponsiveDialog>