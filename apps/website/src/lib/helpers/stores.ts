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

export const lastActiveTab = persist(
        writable<null|'plain'|'synced'>(null),
        createLocalStorage(true),
        'last-active-tab'
    );