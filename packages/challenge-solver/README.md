<div align="center">
    <img src="https://github.com/catplvsplus/lrclib.js/blob/main/website/static/banner.png?raw=true" width="300">
    <h3 style="margin-top: 0">A library for interacting with lrclib.net API</h3>
</div>

---

## Challenge Solver
A Javascript & WebAssembly implementation of the proof-of-work challenge solver for lrclib.net API.

## Installation

```
npm i @lrclib.js/challenge-solver
```

## Usage

### Javascript

A simple example of using the challenge solver without WebAssembly.
```js
import { ChallengeSolver } from '@lrclib.js/challenge-solver';

const challengeSolver = new ChallengeSolver({
    prefix: 'VXMwW2qPfW2gkCNSl1i708NJkDghtAyU',
    target: '000000FF00000000000000000000000000000000000000000000000000000000'
});

const token = await challengeSolver.solve().then(data => data.token);
```

### WebAssembly

The same `ChallengeSolver` but uses WebAssembly for the core functions such as hashing and verifying.
```js
import { wasm } from '@lrclib.js/challenge-solver';

const challengeSolver = new wasm.ChallengeSolver({
    prefix: 'VXMwW2qPfW2gkCNSl1i708NJkDghtAyU',
    target: '000000FF00000000000000000000000000000000000000000000000000000000'
});

const token = await challengeSolver.solve().then(data => data.token);
```

`wasm.ChallengeSolver.solve()` is not entirely implemented using WebAssembly. It is a hybrid implementation that uses WebAssembly for the core functions, while the whole method is implemented in Javascript.

If you want to use solve the challenge entirely in WebAssembly, you can use the `wasmSolve()` method of `wasm.ChallengeSolver` that takes the prefix and target as arguments and returns the solved nonce.

```js
import { wasm } from '@lrclib.js/challenge-solver';

const challenge = {
    prefix: 'VXMwW2qPfW2gkCNSl1i708NJkDghtAyU',
    target: '000000FF00000000000000000000000000000000000000000000000000000000'
};

const nonce = await wasm.ChallengeSolver.wasmSolve(challenge.prefix, challenge.target);
const token = `${challenge.prefix}:${nonce}`;
```

## Disclaimer

Solving the proof-of-work challenge is a CPU-intensive task, and it may take a long time to solve the challenge depending on the difficulty of the target. It may block the main thread and cause the program to become unresponsive. It is recommended to use a `Worker` to run the solver in a separate thread.