export async function GET() {
    const sitemap = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>https://lrclib.foo.ng/</loc>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://lrclib.foo.ng/library</loc>
        <priority>0.70</priority>
    </url>
    <url>
        <loc>https://lrclib.foo.ng/player</loc>
        <priority>0.50</priority>
    </url>
    <url>
        <loc>https://lrclib.foo.ng/publish</loc>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>https://lrclib.foo.ng/search</loc>
        <priority>0.80</priority>
    </url>
</urlset>
`.trim();

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'text/xml',
        },
    });
}