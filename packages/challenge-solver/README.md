<div align="center">
    <img src="https://raw.githubusercontent.com/catplvsplus/lrclib.js/refs/heads/main/apps/website/static/banner.png" width="300">
    <h3 style="margin-top: 0">A library for interacting with lrclib.net API</h3>
</div>

---

```
npm i @lrclib.js/challenge-solver
```

## Usage

```js
import { ChallengeSolver } from '@lrclib.js/challenge-solver';

const challengeSolver = new ChallengeSolver({
    prefix: 'VXMwW2qPfW2gkCNSl1i708NJkDghtAyU',
    target: '000000FF00000000000000000000000000000000000000000000000000000000'
});

const token = await challengeSolver.solve().then(data => data.token);
```
