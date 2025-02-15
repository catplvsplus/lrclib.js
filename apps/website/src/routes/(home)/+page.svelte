<script lang="ts">
    import NavBar from '$lib/components/shared/NavBar.svelte';
    import SearchBox from '$lib/components/shared/SearchBox.svelte';
    import { ScrollArea } from '$lib/components/ui/scroll-area/index';
    import { codeToHtml } from 'shiki';
    import { exampleCode } from '$lib/helpers/constants';
    import { cn } from '../../lib/helpers/utils';
    import Install from '../../lib/components/shared/Install.svelte';
    import { base } from '$app/paths';
</script>

<svelte:head>
    <title>Lrclib.js</title>
</svelte:head>

<NavBar addSearchBox={false}/>
<div class={cn("w-full h-[70%] min-h-96 flex justify-center items-center pt-16")}>
    <div class="text-center px-5">
        <h1 class="text-6xl font-bold leading-tight tracking-tighter">Lrclib<span class="text-primary">.js</span></h1>
        <p class="text-lg sm:text-xl text-muted-foreground my-3">A javascript library for interacting with <a href="http://lrclib.net" target="_blank" rel="noopener noreferrer" class="text-primary">lrclib.net</a> API</p>
        <SearchBox class="max-w-96 mt-4 inline-flex"/>
        <p class="mt-2 text-sm text-muted-foreground">
            Cannot find the lyrics?
            <a href="{base}/publish" class="text-primary hover:underline">
                Publish lyrics
            </a>
        </p>
    </div>
</div>
<div class="text-center pb-4">
    <div class="text-foreground">
        <h4 class="font-semibold text-2xl opacity-80">Library Usage</h4>
        <span class="bg-muted h-1 w-10 rounded inline-block mt-10"></span>
    </div>
</div>
<div class="usage flex justify-center">
    <div class="w-full max-w-screen-2xl p-5 flex flex-col gap-5 items-center">
        <Install/>
        {#await codeToHtml(exampleCode, {
            lang: 'ts',
            themes: {
                light: 'github-light-default',
                dark: 'github-dark-high-contrast'
            },
        }) then html}
            <ScrollArea class="w-full max-w-[800px] border rounded-lg" orientation="both">
                {@html html}
            </ScrollArea>
        {/await}
    </div>
</div>
<style lang="postcss">
    .usage :global(pre) {
        @apply p-4 w-full;
    }
</style>