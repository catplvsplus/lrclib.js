export async function GET({ url }) {
    const base = url.origin;
    const details = {
        shortName: 'Lrclib.js',
        description: 'Lrclib.js - A JavaScript library for interacting with lrclib.net API',
        inputEncoding: 'UTF-8',
        image: {
            width: 16,
            height: 16,
            type: 'image/x-icon',
            url: `${base}/favicon.ico`,
        },
        searchURL: `${base}/search?q={searchTerms}`,
        suggestionURL: `${base}/search/suggestions?q={searchTerms}`,
    };

    const content = `<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
    <ShortName>${details.shortName}</ShortName>
    <Description>${details.description}</Description>
    <InputEncoding>${details.inputEncoding}</InputEncoding>
    <Image width="${details.image.width}" height="${details.image.height}" type="${details.image.type}">${details.image.url}</Image>
    <Url type="text/html" method="get" template="${details.searchURL}"/>
    <Url type="application/x-suggestions+json" template="${details.suggestionURL}"/>
</OpenSearchDescription>`

    return new Response(content, {
        headers: {
            'Content-Type': 'application/opensearchdescription+xml',
        },
    });
}