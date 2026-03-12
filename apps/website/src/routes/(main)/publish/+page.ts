import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { publishTrackSchema } from '$lib/helpers/schema';
import { publishDraft } from '$lib/helpers/classes/PublishDraft.svelte';
import { definePageMetaTags } from 'svelte-meta-tags';

export async function load() {
    const metatags = {
        title: 'Lrclib.js Publish',
        description: 'Publish lyrics from Lrclib.js to lrclib.net',
    }

    return {
        form: await superValidate({
            ...publishDraft.draft.current,
            token: ''
        }, zod(publishTrackSchema)),
        ...definePageMetaTags({
            ...metatags,
            openGraph: metatags
        })
    }
}