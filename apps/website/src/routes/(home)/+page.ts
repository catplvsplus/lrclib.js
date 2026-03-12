import { codeToHtml } from 'shiki';

export async function load({ url, fetch }) {
    const code = await fetch(`${url.origin}/usage/index.ts`).then(res => res.text()).catch(() => null);

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