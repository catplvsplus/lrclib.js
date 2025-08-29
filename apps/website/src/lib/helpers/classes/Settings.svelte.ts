import { PersistedState } from 'runed';
import { prefersReducedMotion } from 'svelte/motion';
import { MediaQuery } from 'svelte/reactivity';

export class Settings {
    public mediaPrefersReducedTransparency = new MediaQuery('(prefers-reduced-transparency: reduce)')
    public mediaPrefersReducedMotion = $derived(prefersReducedMotion);

    public userPrefersReducedTransparency = new PersistedState<boolean|number>('lrclib-prefers-reduced-transparency', 0);
    public userPrefersReducedMotion = new PersistedState<boolean|number>('lrclib-prefers-reduced-motion', 0);

    public prefersReducedTransparency = $derived(this.userPrefersReducedTransparency.current != 0 ? this.userPrefersReducedTransparency.current : this.mediaPrefersReducedTransparency.current);
    public prefersReducedMotion = $derived(this.userPrefersReducedMotion.current != 0 ? this.userPrefersReducedMotion.current : this.mediaPrefersReducedMotion.current);

    public lyricsDelay = new PersistedState<number>('lrclib-lyrics-delay', 0);
}

export const settings = new Settings();