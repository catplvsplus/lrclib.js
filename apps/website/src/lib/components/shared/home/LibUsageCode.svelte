<script lang="ts">
    import { resolve } from '$app/paths';
    import { mode } from 'mode-watcher';
    import { ScrollArea } from '../../ui/scroll-area';
    import { codeToHtml } from 'shiki';

    let code = $state('');

    $effect(() => {
        fetch(`${resolve('/')}usage/index.ts`)
            .then(async res => code = await res.text());
    });
</script>

<ScrollArea orientation="both" class="w-full border overflow-hidden rounded-lg mt-2 text-start text-sm [&_pre]:p-4 [&_*]:select-text">
    {#await codeToHtml(code, { lang: 'typescript', theme: mode.current === 'dark' ? 'dark-plus' : 'light-plus' }) then html}
        {@html html}
    {/await}
</ScrollArea>