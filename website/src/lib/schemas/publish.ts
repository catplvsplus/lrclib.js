import { LRCParser } from '@braccato/parsers';
import z from 'zod';

export const publishSchema = z.object({
    trackName: z.string().min(1).default(''),
    artistName: z.string().min(1).default(''),
    albumName: z.string().min(1).default(''),
    duration: z.coerce.number().min(0).positive().int(),
    plainLyrics: z.string().default(''),
    syncedLyrics: z
        .string()
        .trim()
        .refine(
            val => !val.trim() || LRCParser.detect(val),
            'Invalid LRC lyrics'
        )
        .default('')
});

export type PublishSchema = z.infer<typeof publishSchema>;