import { z } from 'zod';

export const exampleCode = `import { lrclib, Client } from 'lrclib.js';

// Get lyrics for a track
await lrclib.search('Born To Die');
await lrclib.search({ track_name: 'Born To Die', artist_name: 'Lana Del Rey' });
await lrclib.fetchTrack({ track_name: 'Born To Die', artist_name: 'Lana Del Rey', duration: 285 });
await lrclib.fetchTrackById(13373);

// Publish a track
const client = new Client();
await client.publishTrack({
    trackName: 'Born To Die',
    artistName: 'Lana Del Rey',
    albumName: 'Born To Die',
    duration: 285,
    plainLyrics: 'Feet don\\'t fail me now...',
    syncedLyrics: '[00:22.83] Feet, don\\'t fail me now...'
});`;

export const trackSignatureSearchSchema = z.object({
    track_name: z.string(),
    artist_name: z.string().optional(),
    album_name: z.string().optional()
})