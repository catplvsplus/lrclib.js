import { LRC } from 'lrclib.js';
import z from 'zod/v3';

export const publishTrackSchema = z.object({
    trackName: z.string().min(1).default(''),
    artistName: z.string().min(1).default(''),
    albumName: z.string().min(1).default(''),
    duration: z.coerce.number().min(0).positive().int(),
    plainLyrics: z.string().default(''),
    syncedLyrics: z
        .string()
        .trim()
        .refine(val => !val.trim() || LRC.isValidLRC(val), 'Invalid LRC lyrics')
        .default(''),
    token: z.string().optional(),
});

export type PublishTrackSchema = z.infer<typeof publishTrackSchema>;