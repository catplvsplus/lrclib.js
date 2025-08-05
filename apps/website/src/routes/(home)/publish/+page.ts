import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { publishTrackSchema } from '$lib/helpers/schema';
import { publishTrackDraft } from '../../../lib/helpers/metadata';

export async function load() {
    return {
        form: await superValidate(zod(publishTrackSchema), {
            defaults: publishTrackDraft.current
        })
    }
}