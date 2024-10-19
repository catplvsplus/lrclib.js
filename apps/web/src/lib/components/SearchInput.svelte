<script lang="ts">
    import { goto } from '$app/navigation';
    import { search } from '../stores/search';
    import { cn } from '../helpers/utils';
    import Search from 'lucide-svelte/icons/search';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';

    export let focused = false;
    export let mini = false;
    export let input: HTMLInputElement|null = null;
    export let bindValue: boolean = true;

    let value: string = '';

    $: value, bindValue && search.set(value);

    function onSubmit() {
        const query = encodeURIComponent(value.trim() ?? '');
        if (!query) {
            setTimeout(() => input?.focus(), 500);
            return;
        }

        goto(`${base}/search?q=${query}`);
    }

    onMount(() => {
        const unsubscribe = search.subscribe(v => value = v ?? '');
        return () => unsubscribe();
    });
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
        bind:value={value}
        bind:this={input}
        placeholder="Search"
        type="search"
        class="w-full max-w-72 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
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