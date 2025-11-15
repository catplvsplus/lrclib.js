import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { publishTrackSchema } from '$lib/helpers/schema';
import { publishDraft } from '$lib/helpers/classes/PublishDraft.svelte';

export const prerender = true;
export const ssr = false;

export async function load() {
    return {
        form: await superValidate({
            ...publishDraft.draft.current,
            token: ''
        }, zod(publishTrackSchema))
    }
}