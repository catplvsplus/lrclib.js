import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { publishTrackSchema } from '$lib/helpers/schema.js';
import { error, fail } from '@sveltejs/kit';
import { REST } from 'lrclib.js';
import { Routes } from 'lrclib.js';

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod4(publishTrackSchema));
        const token: string = request.headers.get('X-Publish-Token') ?? '';

        if (!form.valid) return fail(400, { form });
        if (!token) return error(400, { message: 'Missing publish token' });

        return REST.post(Routes['/api/publish'](), {
            json: form.data,
            headers: {
                'X-Publish-Token': token
            }
        })
        .then(res => res.ok
            ? message(form, { message: `Published track ${form.data.trackName}` })
            : error(res.status, { message: res.statusText })
        )
        .catch(err => error(500, { message: err.message }))
    }
};