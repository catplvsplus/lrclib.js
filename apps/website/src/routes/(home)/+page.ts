import { codeToHtml } from 'shiki';

export async function load({ url, fetch }) {
    const code = await (await fetch(`${url.origin}/usage/index.ts`)).text().catch(() => null);

    return {
        code: code
        ? codeToHtml(code, {
            lang: 'typescript',
            themes: {
                light: 'light-plus',
                dark: 'dark-plus'
            },
            defaultColor: false
        })
        : null
    };
}