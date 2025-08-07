import { LRC } from 'lrclib.js';
import z from 'zod/v4';

export const publishTrackSchema = z.object({
    trackName: z.string().min(1),
    artistName: z.string().min(1),
    albumName: z.string().min(1),
    duration: z.coerce.number().min(0).int(),
    plainLyrics: z.string().default(''),
    syncedLyrics: z
        .string()
        .trim()
        .refine(val => !val.trim() || LRC.isValidLRC(val), {
            error: 'Invalid LRC lyrics'
        })
        .default(''),
});

export type PublishTrackSchema = z.infer<typeof publishTrackSchema>;