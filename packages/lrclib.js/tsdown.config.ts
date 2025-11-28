import { defineConfig } from "tsdown";
import { replacePlugin } from "rolldown/plugins";
import path from 'node:path';

const packageJson = await import(`file://${path.join(process.cwd(), 'package.json')}`, { with: { type: 'json' } }).then(mod => mod.default);

export default defineConfig({
    entry: ['src/index.ts'],
    external: [],
    noExternal: [],
    platform: 'browser',
    format: ['esm'],
    skipNodeModulesBundle: true,
    target: 'esnext',
    clean: true,
    minify: false,
    dts: true,
    sourcemap: true,
    treeshake: true,
    outDir: './dist',
    tsconfig: 'tsconfig.json',
    plugins: [
        replacePlugin({
            'process.env.LIB_VERSION': JSON.stringify(packageJson.version),
        })
    ],
})