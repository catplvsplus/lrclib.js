import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { publishDraft, publisher } from '#lib/helpers/lyrics.js';
import { publishSchema, type PublishSchema } from '../../../lib/schemas/publish';

export const prerender = false;
export const ssr = false;

export async function load() {
    return {
        form: await superValidate<PublishSchema>(
            publisher.publishData ?? publishDraft.current,
            zod4(publishSchema)
        )
    }
}