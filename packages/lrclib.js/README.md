<div align="center">
    <img src="https://raw.githubusercontent.com/catplvsplus/lrclib.js/refs/heads/main/apps/website/static/banner.png" width="300">
    <h3 style="margin-top: 0">A library for interacting with lrclib.net API</h3>
</div>

---

```
npm i lrclib.js
```

## Usage

```js
import lrclib, { ChallengeSolver } from 'lrclib.js';

// Search tracks by query
await lrclib.search('Born This Way');

// Search tracks by track signature
await lrclib.search({
    track_name: 'Born This Way',
    artist_name: 'Lady Gaga',
    album_name: 'Born This Way'
});

// Fetch track signature
await lrclib.fetchTrack({
    track_name: 'Born This Way',
    artist_name: 'Lady Gaga',
    album_name: 'Born This Way',
    duration: 261
});

// Fetch track by id
await lrclib.fetchTrackById(41498);

// Publish track to the API
const challenge = await lrclib.requestChallenge();
const challengeSolver = new ChallengeSolver(challenge);

await lrclib.publishTrack({
    trackName: 'Born This Way',
    artistName: 'Lady Gaga',
    albumName: 'Born This Way',
    duration: 261,
    plainLyrics: '...',
    syncedLyrics: '...',
}, await challengeSolver.solve());
```
