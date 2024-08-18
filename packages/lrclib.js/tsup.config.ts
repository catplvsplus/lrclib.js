import { createTsupConfig } from '../../tsup.config';

export default createTsupConfig({
    outDir: 'dist',
    entry: ['src/index.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    dts: true
});