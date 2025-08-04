// @ts-check
import { lrclib } from 'lrclib.js';

const track = await lrclib.fetchTrackById(23265256);

console.log(track);

await lrclib.publishTrack({
    duration: track.duration,
    trackName: `${track.trackName} - ${track.artistName}`,
    artistName: track.artistName,
    albumName: `${track.trackName} - ${track.albumName}`,
    plainLyrics: track.plainLyrics,
    syncedLyrics: track.syncedLyrics
});