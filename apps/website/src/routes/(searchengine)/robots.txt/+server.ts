import { text } from '@sveltejs/kit';

export async function GET({ url }) {
    const entries = [`User-agent: *`];

    entries.push(`Allow: /`);
    entries.push(`Allow: /library`);
    entries.push(`Allow: /player`);
    entries.push(`Allow: /publish`);
    entries.push(`Allow: /search`);
    entries.push(`Disallow: /track/*`);
    entries.push(`\nSitemap: ${url.origin}/sitemap.xml`);

    return text(entries.join('\n'));
}