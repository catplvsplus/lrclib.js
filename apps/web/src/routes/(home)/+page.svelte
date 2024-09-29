<script lang="ts">
    import * as PageHeader from "$lib/components/ui/page-header/index.js";
    import SearchInput from '$lib/components/SearchInput.svelte';
    import { MetaTags } from 'svelte-meta-tags';
</script>

<svelte:head>
    <title>Lrclib.js</title>
</svelte:head>

<MetaTags title="Lrclib.js" description="A javascript library for interacting with lrclib.net API"/>

<div class="container relative">
    <PageHeader.Root class="pb-8">
		<PageHeader.Heading>Lrclib<span class="text-primary">.js</span></PageHeader.Heading>
		<PageHeader.Description class="text-muted-foreground">
            A javascript library for interacting with <a href="http://lrclib.net" target="_blank" rel="noopener noreferrer" class="text-primary">lrclib.net</a> API
		</PageHeader.Description>
        <div class="flex justify-center items-center w-full space-x-4 py-4 md:pb-10">
            <SearchInput/>
        </div>
	</PageHeader.Root>
</div>

<style lang="scss">
    .container {
        height: 100%;
        min-height: 500px;
        display: flex;
        align-items: center;
    }
</style>