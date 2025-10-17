<script lang="ts">
    import { links } from '$lib/helpers/constants';
    import InstallCommand from '$lib/components/shared/home/InstallCommand.svelte';
    import SearchInput from '$lib/components/shared/home/SearchInput.svelte';
    import CodeBlock from '@/components/shared/home/CodeBlock.svelte';
    import { Button } from '$lib/components/ui/button';
    import { resolve } from '$app/paths';
    import { MetaTags } from 'svelte-meta-tags';

    let { data } = $props();

    let metatags = {
        title: 'Lrclib.js',
        description: 'A library interacting with lrclib.net API'
    };
</script>

<svelte:head>
    <title>Lrclib.js</title>
</svelte:head>

<MetaTags {...metatags} openGraph={metatags}/>

<div class="text-center pt-24 pb-18">
    <Button size="sm" variant="outline" href={resolve('/(main)/player')} class="rounded-full font-bold text-foreground/70 mb-2 text-xs">
        <span class="size-1.5 bg-primary ring-primary/30 ring-3 mr-1 rounded-full animate-pulse"></span>
        Preview Lyrics
    </Button>
    <h1 class="sm:text-7xl text-6xl font-bold tracking-wide text-foreground/80 text-shadow-current/20 text-shadow-lg">Lrclib<span class="text-primary">.js</span></h1>
    <p class="mt-2 sm:text-base text-sm font-medium text-muted-foreground">A library interacting with <a href={links.lrclib} target="_blank" rel="noopener noreferrer" class="border-b border-transparent hover:border-foreground focus-visible::border-foreground">lrclib.net</a> API</p>
    <div class="flex justify-center mt-10 w-full">
        <SearchInput placeholder="Search..." class="transition-all shadow-sm hover:border-primary hover:shadow-lg hover:shadow-primary/20" containerClass="t-10 sm:mx-4 sm:w-[calc(100%-2rem)] w-full max-w-md"/>
    </div>
    <div class="mt-5 sm:mx-4 sm:w-[calc(100%-2rem)] w-full max-w-md inline-block">
        <InstallCommand/>
    </div>
</div>
{#await data.code then code}
<div class="text-center pb-10">
    <h1 class="sm:text-3xl text-2xl font-bold tracking-wide text-foreground/80 text-shadow-current/20">Library Usage</h1>
    <CodeBlock {code} class="mt-5 w-full max-w-4xl mx-auto rounded-xl"/>
</div>
{/await}