<script lang="ts">
    import { base } from '$app/paths';
    import { Search } from 'lucide-svelte';
    import { cn } from '../../helpers/utils';

    let { value = $bindable(""), ...props }: { value?: string; [key: string]: any; } = $props();

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (value) window.location.href = `${base}/search?q=${encodeURIComponent(value)}`;
    }
</script>

<form
    onsubmit={onSubmit}
    {...props}
    class={cn(
        "flex border rounded-lg overflow-hidden h-11 w-full bg-background/50 focus-within:border-primary",
        props.class
    )}
>
    <input type="text" placeholder="Search..." class="py-2 px-4 w-full outline-none bg-transparent" bind:value/>
    <button class="p-2 w-11 h-11 outline-none bg-none text-primary" disabled={!value}>
        <Search size={20}/>
    </button>
</form>