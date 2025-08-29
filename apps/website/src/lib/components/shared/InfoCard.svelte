<script lang="ts">
    import type { Component } from '@lucide/svelte';
    import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import type { WithElementRef } from '$lib/helpers/utils';
    import type { HTMLAttributes } from 'svelte/elements';

    let {
        ref = $bindable(null),
        icon,
        title,
        description,
        ...props
    }: {
        icon?: typeof Component;
        title?: string;
        description?: string;
    } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<Card bind:ref {...props}>
    <CardHeader>
        {#if title}
            <CardTitle class="flex items-center gap-1">
                {#if icon}
                    {@const Icon = icon}
                    <Icon class="text-primary size-5"/>
                {/if}
                {title}
            </CardTitle>
        {/if}
        {#if description}
            <CardDescription>
                {description}
            </CardDescription>
        {/if}
    </CardHeader>
</Card>