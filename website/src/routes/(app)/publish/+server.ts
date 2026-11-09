import { publishSchema } from '#lib/schemas/publish.js';
import { REST, Routes } from 'lrclib.js';

export async function POST({ request, fetch }) {
    const formData = await request.formData();
    const publishData = await publishSchema.safeParseAsync(Object.fromEntries(formData.entries()));
    const publishToken = request.headers.get('X-Publish-Token');

    if (!publishToken) {
        return Response.json({ error: 'Missing publish token' }, { status: 400 });
    }

    if (!publishData.success) {
        return Response.json({ error: 'Invalid publish data' }, { status: 400 });
    }

    const response = await fetch(`${REST.baseURL}${Routes['/api/publish']()}`, {
        method: 'POST',
        headers: {
            ...REST.headers,
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