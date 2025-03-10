import { defineConfig } from "tsup";
import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';

export default defineConfig({
    entry: ['src/index.ts'],
    external: [],
    noExternal: [],
    platform: 'neutral',
    format: ['esm'],
    skipNodeModulesBundle: true,
    target: 'esnext',
    clean: true,
    minify: false,
    terserOptions: {
        mangle: false,
        keep_classnames: true,
        keep_fnames: true
    },
    splitting: false,
    keepNames: true,
    dts: true,
    sourcemap: true,
    esbuildPlugins: [
        // @ts-expect-error
        esbuildPluginVersionInjector()
    ],
    treeshake: true,
    outDir: './dist',
    tsconfig: 'tsconfig.json',
})