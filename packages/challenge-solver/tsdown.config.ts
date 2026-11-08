import { defineConfig } from 'tsdown';
import config from '../lrclib.js/tsdown.config.ts';

export default defineConfig({
    ...config,
    entry: ['src/index.ts'],
    copy: [
        { from: 'wasm/*', to: 'dist' }
    ]
});