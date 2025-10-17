export async function load({ url, fetch }) {
    return {
        code: (await fetch(`${url.origin}/usage/index.ts`)).text()
    };
}