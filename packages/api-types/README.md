<div align="center">
    <img src="https://raw.githubusercontent.com/catplvsplus/lrclib.js/refs/heads/main/apps/website/static/banner.png" width="300">
    <h3 style="margin-top: 0">A library for interacting with lrclib.net API</h3>
</div>

---

```
npm i @lrclib.js/api-types
```

## Usage

```ts
import { type APIOptions, type APIResponse, Routes } from '@lrclib.js/api-types';

const options: APIOptions.Get.Search = {
    q: 'Afterglow Taylor Swift'
};

const response: APIResponse.Get.SearchQuery = await fetch(
    Routes[`/api/search`](options)
).then(res => res.json());
```
