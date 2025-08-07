import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { publishTrackSchema } from '$lib/helpers/schema';
import { publishTrackDraft } from '../../../lib/helpers/metadata';

export async function load() {
    return {
        form: await superValidate(zod4(publishTrackSchema), {
            defaults: publishTrackDraft.current
        })
    }
}