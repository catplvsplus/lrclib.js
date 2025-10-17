import { codeToHtml } from 'shiki';

export async function load({ url, fetch }) {
    return {
        code: codeToHtml(await (await fetch(`${url.origin}/usage/index.ts`)).text(), {
            lang: 'typescript',
            themes: {
                light: 'light-plus',
                dark: 'dark-plus'
            },
            defaultColor: false
        })
    };
}