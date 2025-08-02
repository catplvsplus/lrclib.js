import { PersistedState } from 'runed';
import { MediaQuery } from 'svelte/reactivity';

export const prefersReducedTransparency = new MediaQuery('(prefers-reduced-transparency: reduce)');

export const settings = new PersistedState<ISettings>('lrclib-settings', {
    prefersReducedMotion: null,
    prefersReducedTransparency: null
});

export interface ISettings {
    prefersReducedMotion: boolean|null;
    prefersReducedTransparency: boolean|null;
    [key: string]: any;
}