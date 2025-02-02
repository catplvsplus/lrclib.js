import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";
import { writable } from 'svelte/store';

export const isBlurAllowed = persist(
        writable<null|boolean>(null),
        createLocalStorage(true),
        'allow-blurs'
    );

export const isPreviewAllowed = persist(
        writable<boolean>(true),
        createLocalStorage(true),
        'allow-previews'
    );