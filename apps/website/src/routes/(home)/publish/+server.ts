import { error, json } from '@sveltejs/kit';
import { REST, Routes, type APIOptions } from 'lrclib.js';
import { publishTrackSchema } from '../../../lib/helpers/schema.js';

// TODO: I wan't to do it serverless :(
export async function PUT({ request, fetch }): Promise<Response> {
    const data: APIOptions.Post.Publish = await request.json();
    const token: string = request.headers.get('X-Publish-Token') ?? '';

    if (!token) return error(400, { message: 'Missing publish token' });
    if (!publishTrackSchema.safeParse(data).success) return error(400, { message: 'Invalid track data' });

    return REST.post(Routes['/api/publish'](), {
        json: data,
        headers: {
            'X-Publish-Token': token
        }
    })
    .then(res => res.ok ? json({ success: true }) : error(res.status, { message: res.statusText }))
    .catch(err => error(500, { message: err.message }));
}