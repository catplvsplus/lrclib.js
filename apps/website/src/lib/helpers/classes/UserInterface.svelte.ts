import { MediaQuery } from 'svelte/reactivity';
import isMobile from 'is-mobile';

export class UserInterface {
    public smallScreen = new MediaQuery('(max-width: 639px)');
    public menuMode: 'side'|'bottom'|'none' = $state('side');
    public playerMode: 'visible'|'hidden' = $state('visible');
    public playerMenu: 'queue'|'lyrics' = $state('queue');
    public isMobile: boolean = $state(isMobile())
}

export const userInterface = new UserInterface();