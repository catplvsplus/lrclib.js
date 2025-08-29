import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { publishTrackSchema } from '$lib/helpers/schema';
import { publishDraft } from '$lib/helpers/classes/PublishDraft.svelte';

export async function load() {
    return {
        form: await superValidate(zod(publishTrackSchema), {
            defaults: {
                ...publishDraft.draft.current,
                token: ''
            }
        })
    }
}