import { writable } from '@macfja/svelte-persistent-store';
import isMobile from 'is-mobile';

export const enableBlur = writable('enableBlur', isMobile() ? false : true);