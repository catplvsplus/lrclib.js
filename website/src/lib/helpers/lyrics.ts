import { PersistedState } from 'runed';
import { publishSchema } from '../schemas/publish';
import { LyricsPublisher } from '../classes/LyricsPublisher.svelte';

export const publishDraft = new PersistedState('publish-draft', publishSchema.safeParse({}).data);
export const publisher = new LyricsPublisher();