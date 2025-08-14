import { MediaQuery } from 'svelte/reactivity';

export class UserInterface {
    public smallScreen = new MediaQuery('(max-width: 639px)');
    public menuMode: 'side'|'bottom'|'none' = $state('side');
}

export const userInterface = new UserInterface();