import type { MetaTagsProps } from 'svelte-meta-tags';
import 'vite-plugin-pwa/svelte';
import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/pwa-assets';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
            pageMetaTags?: MetaTagsProps;
        }
		interface PageState {
            dialogs?: string[];
        }
		// interface Platform {}
	}
}

export {};
