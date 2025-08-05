import { SiBun, SiDeno, SiNpm, SiPnpm, SiYarn } from '@icons-pack/svelte-simple-icons';
import type { ComponentType } from 'svelte';

export const links = {
    github: 'https://github.com/catplvsplus/lrclib.js',
    npm: 'https://www.npmjs.com/package/lrclib.js',
    contact: 'https://catplvsplus.is-a.dev',
    lrclib: 'https://lrclib.net'
};

export const installCommands: (Record<'pkgManager'|'command', string> & { icon?: ComponentType; })[] = [
    {
        icon: SiNpm,
        pkgManager: 'npm',
        command: 'npm install lrclib.js'
    },
    {
        icon: SiYarn,
        pkgManager: 'yarn',
        command: 'yarn add lrclib.js'
    },
    {
        icon: SiPnpm,
        pkgManager: 'pnpm',
        command: 'pnpm add lrclib.js'
    },
    {
        icon: SiBun,
        pkgManager: 'bun',
        command: 'bun install lrclib.js'
    },
    {
        icon: SiDeno,
        pkgManager: 'deno',
        command: 'deno install npm:lrclib.js'
    }
];