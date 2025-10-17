import { LRC } from 'lrclib.js';
import z from 'zod';

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

export const searchTrackQuerySchema = z.object({
    q: z.string().min(1).default(''),
});

export const searchTrackSignatureSchema = z.object({
    track_name: z.string().min(1).default(''),
    artist_name: z.string().min(1).optional(),
    album_name: z.string().min(1).optional(),
});

export const searchTrackSchema = z.union([searchTrackQuerySchema, searchTrackSignatureSchema]);