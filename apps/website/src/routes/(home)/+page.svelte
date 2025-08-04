<script lang="ts">
    import Topbar from '$lib/components/shared/home/Topbar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { links } from '$lib/helpers/constants';
    import { resolve } from '$app/paths';
    import InstallCommand from '$lib/components/shared/home/InstallCommand.svelte';
</script>

<Topbar/>
<div class="min-h-full pt-16 flex justify-center relative overflow-clip">
    <div class="absolute -top-1/2 left-1/2 transform -translate-x-1/2 size-dvh bg-radial from-primary/10 to-transparent from-0% to-60%"></div>
    <main class="container p-4 flex flex-col gap-4 relative z-10">
        <div class="text-center py-24">
            <h1 class="sm:text-7xl text-5xl font-bold tracking-wide text-foreground/80 text-shadow-current/20 text-shadow-lg">Lrclib<span class="text-primary">.js</span></h1>
            <p class="mt-2 sm:text-base text-sm font-medium text-muted-foreground">A library interacting with <a href={links.lrclib} target="_blank" rel="noopener noreferrer" class="border-b border-transparent hover:border-foreground focus-visible::border-foreground">lrclib.net</a> API</p>
            <InstallCommand class="mt-4 inline-block"/>
        </div>
    </main>
</div>