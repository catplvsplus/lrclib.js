<script lang="ts">
    import { resolve } from '$app/paths';
    import { mode } from 'mode-watcher';
    import { ScrollArea } from '../../ui/scroll-area';
    import { codeToHtml, codeToTokens } from 'shiki';
    import type { ScrollAreaRootProps } from 'bits-ui';
    import { cn } from '../../../helpers/utils';

    let props: Omit<ScrollAreaRootProps, 'orientation'> = $props();
    let code = $state('');

    $effect(() => {
        fetch(`${resolve('/')}usage/index.ts`)
            .then(async res => code = await res.text());
    });
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