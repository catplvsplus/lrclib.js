import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { unwasm } from 'unwasm/plugin';


export default defineConfig({
    optimizeDeps: {
        exclude: ['@lrclib/challenge-solver']
    },
	plugins: [
		tailwindcss(),
        unwasm({}),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	],
    server: {
        fs: {
            allow: [
                searchForWorkspaceRoot(process.cwd())
            ]
        }
    }
});
