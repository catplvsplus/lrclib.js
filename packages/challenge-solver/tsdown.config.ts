import config from '../lrclib.js/tsdown.config.ts';
import { defineConfig } from 'tsdown';
import { unwasm } from 'unwasm/plugin';

export default defineConfig({
    ...config,
    entry: ['src/**/*.ts'],
    unbundle: true,
    plugins: [
        unwasm({})
    ]
});