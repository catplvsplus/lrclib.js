<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { search } from '../stores/search';
    import { cn, parseSearchParams } from '../helpers/utils';
    import Search from 'lucide-svelte/icons/search';

    export let focused = false;
    export let mini = false;
    export let input: HTMLInputElement|null = null;

    onMount(() => {
        $search = parseSearchParams(window.location.search).q || '';
    });

    function onSubmit() {
        const query = encodeURIComponent($search.trim());
        if (!query) {
            setTimeout(() => input?.focus(), 500);
            return;
        }

        goto(`/search?q=${query}`);
    }
</script>

<form
    {...$$props}
    class={cn(
        "inline-flex w-full max-w-80 h-10 border border-input bg-foreground/20 dark:bg-background ring-offset-background focus-within:ring-ring rounded-md overflow-hidden",
        $$props.class || ''
    )}
    class:mini={mini && !focused}
    on:submit|preventDefault={onSubmit}
    on:focusin={() => (focused = true)}
    on:focusout={() => (focused = false)}
>
    <input
        bind:value={$search}
        bind:this={input}
        placeholder="Search"
        type="search"
        class="w-full max-w-72 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
    />
    <button type="submit" class="shrink-0 w-10 h-10 p-0 flex justify-center items-center outline-none">
        <Search size="18" font-weight="bold" class="text-primary"/>
    </button>
</form>

<style lang="scss">
    form.minimized.mini {
        width: auto;

        input {
            width: 0;
            padding: 0;
        }
    }
</style>