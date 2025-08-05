import z from 'zod';

export const publishTrackSchema = z.object({
    trackName: z.string().min(1),
    artistName: z.string().min(1),
    albumName: z.string().min(1),
    duration: z.coerce.number().min(0),
    plainLyrics: z.string(),
    syncedLyrics: z.string(),
});

export type PublishTrackSchema = z.infer<typeof publishTrackSchema>;