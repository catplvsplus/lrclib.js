<script lang="ts">
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
    import { Input } from "@/components/ui/input";
    import { Button } from '../../ui/button';
    import { SearchIcon } from '@lucide/svelte';
    import { cn } from '../../../helpers/utils';
    import type { ClassValue } from 'clsx';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    let {
        ref = $bindable(null),
        type,
        containerClass,
        onSubmit,
        ...props
    }: {
        ref?: HTMLInputElement|null;
        type?: Exclude<HTMLInputTypeAttribute, "file">;
        files?: undefined;
        containerClass?: ClassValue;
        onSubmit?: (event: SubmitEvent) => void;
    } & Omit<HTMLInputAttributes, 'type'> = $props();

    let value = $state('');

    onSubmit ??= (event: SubmitEvent) => {
        event.preventDefault();

        goto(`${resolve('/lyrics')}?q=${encodeURIComponent(value)}`);
    };
</script>

<form onsubmit={onSubmit} class={cn("relative", containerClass)}>
    <Input bind:value bind:ref {type} {...props} class={cn("text-base pr-10E w-full rounded-lg", props.class)}/>
    <Button type="submit" class="absolute top-0 right-0 rounded-l-none text-primary! bg-transparent! cursor-pointer" variant="ghost">
        <SearchIcon class="size-4!"/>
    </Button>
</form>