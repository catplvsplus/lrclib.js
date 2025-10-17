<script lang="ts">
    import { resolve } from '$app/paths';
    import { ScrollArea } from '../../ui/scroll-area';
    import { codeToHtml } from 'shiki';
    import type { ScrollAreaRootProps } from 'bits-ui';
    import { cn } from '../../../helpers/utils';

    let { code, ...props}: { code: string } & Omit<ScrollAreaRootProps, 'orientation'> = $props();
</script>

<ScrollArea {...props} orientation="both" class={cn("w-full border overflow-hidden rounded-lg mt-2 text-start text-sm [&_pre]:p-4 [&_*]:select-text", props.class)}>
    {#await codeToHtml(code, {
        lang: 'typescript',
        themes: {
            light: 'light-plus',
            dark: 'dark-plus'
        },
        defaultColor: false
    }) then html}
        {@html html}
    {/await}
</ScrollArea>