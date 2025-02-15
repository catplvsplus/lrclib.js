<script lang="ts">
    import { base } from '$app/paths';
    import { Search } from 'lucide-svelte';
    import { cn } from '../../helpers/utils';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';

    let {
        value = $bindable(""),
        ref = $bindable(),
        autofocus = false,
        onChange,
        ...props
    }: {
        value?: string;
        ref?: HTMLInputElement;
        onChange?: (data: string) => void;
        autofocus?: boolean;
        [key: string]: any;
    } = $props();

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (!value) return;
        onChange?.(value);
        goto(`${base}/search?q=${encodeURIComponent(value)}`);
    }

    onMount(() => {
        if (autofocus) setTimeout(() => ref?.focus(), 500);
    });
</script>

<form
    onsubmit={onSubmit}
    {...props}
    class={cn(
        "flex border rounded-lg overflow-hidden h-11 w-full bg-background/50 focus-within:border-primary",
        props.class
    )}
>
    <input
        type="text"
        placeholder="Search lyrics..."
        bind:this={ref}
        class="py-2 px-4 w-full outline-none bg-transparent"
        bind:value
        oninput={event => onChange?.(event.currentTarget.value)}
        autocomplete="off"
        aria-autocomplete="none"
    />
    <button class="p-2 w-11 h-full flex-shrink-0 outline-none bg-none text-primary flex justify-center items-center enabled:scale-110 transition-transform duration-300" disabled={!value}>
        <Search size={20}/>
    </button>
</form>