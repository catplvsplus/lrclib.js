import { publishSchema } from '#lib/schemas/publish.js';
import { REST, Routes, wasm } from 'lrclib.js';

export async function POST({ request, fetch }) {
    const publishData = await publishSchema.safeParseAsync(await request.json());
    const publishToken = request.headers.get('X-Publish-Token');
    const publishTarget = request.headers.get('X-Publish-Target');

    if (!publishToken) {
        return Response.json({ error: 'Missing publish token' }, { status: 400 });
    }

    if (!publishData.success) {
        return Response.json({ error: 'Invalid publish data' }, { status: 400 });
    }

    if (import.meta.env.DEV && publishTarget) {
        const [prefix, nonce] = publishToken.split(':');

        const validToken = await wasm.ChallengeSolver.verify({
            prefix,
            target: publishTarget,
        }, parseInt(nonce, 10));

        console.log(`DEV mode publish token validation (${prefix}:${nonce}):`, validToken);

        if (!validToken) {
            return Response.json({ error: 'Invalid publish token' }, { status: 400 });
        }

        return Response.json({ message: 'Publish successful (DEV mode)' }, { status: 200 });
    }

    const response = await fetch(`${REST.baseURL}${Routes['/api/publish']()}`, {
        method: 'POST',
        headers: {
            ...REST.headers,
            'Content-Type': 'application/json',
            'X-Publish-Token': publishToken,
        },
        body: JSON.stringify(publishData.data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return Response.json({ error: errorText }, { status: response.status });
    }

    return Response.json({ message: 'Publish successful' }, { status: 200 });
}