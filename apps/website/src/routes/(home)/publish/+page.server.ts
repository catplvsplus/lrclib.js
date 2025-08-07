import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { publishTrackSchema } from '$lib/helpers/schema.js';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { REST, Routes } from 'lrclib.js';

export const actions: Actions = {
    default: async event => {
        const form = await superValidate(event.request, zod4(publishTrackSchema));

        if (!form.data.token) return fail(400, { form, message: 'Missing publish token' });
        if (!form.valid) return fail(400, { form });

        return REST.post(Routes['/api/publish'](), {
            json: form.data,
            headers: {
                'X-Publish-Token': form.data.token
            }
        })
        .then(res => res.ok
            ? message(form, { message: `Published track ${form.data.trackName}` })
            : fail(res.status, { form, message: res.statusText })
        )
        .catch(err => fail(500, { form, message: err.message }));
    }
};