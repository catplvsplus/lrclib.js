<script lang="ts">
    import * as PageHeader from "$lib/components/ui/page-header/index.js";
    import { onMount } from 'svelte';
    import { parseSearchParams } from '../lib/helpers/utils';
    import Search from 'lucide-svelte/icons/search';
    import { search } from '../lib/stores/search';
    import { goto } from '$app/navigation';

    onMount(() => {
        $search = parseSearchParams(window.location.search).q || '';
    });
</script>

<div class="container relative">
    <PageHeader.Root class="pb-8">
		<PageHeader.Heading>Lrclib<span class="text-primary">.js</span></PageHeader.Heading>
		<PageHeader.Description class="text-muted-foreground">
            A javascript library for interacting with <a href="http://lrclib.net" target="_blank" rel="noopener noreferrer" class="text-primary">lrclib.net</a> API
		</PageHeader.Description>
        <div class="flex justify-center items-center w-full space-x-4 py-4 md:pb-10">
            <form
                class="flex w-full max-w-80 h-11 border border-input bg-foreground/20 dark:bg-background ring-offset-background focus-within:ring-ring rounded-md overflow-hidden"
                on:submit|preventDefault={() => $search.trim() && goto(`/search?q=${encodeURIComponent($search)}`)}
            >
                <input bind:value={$search} placeholder="Search" type="search" class="w-full max-w-72 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"/>
                <button type="submit" class="shrink-0 w-10 h-10 flex justify-center items-center outline-none">
                    <Search size="16" class="text-primary"/>
                </button>
            </form>
        </div>
	</PageHeader.Root>
</div>

<style lang="scss">
    .container {
        @apply pt-14;
    }
</style>