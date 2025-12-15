import { defineConfig } from 'tsdown';
import config from '../lrclib.js/tsdown.config.ts';

export default defineConfig({
    ...config,
    entry: ['src/index.ts'],
    copy: ['wasm/wasm_exec.d.ts', 'wasm/wasm_exec.js'],
});