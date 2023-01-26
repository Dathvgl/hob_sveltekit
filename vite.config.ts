import { sveltekit } from '@sveltejs/kit/vite';

const config: import('vite').UserConfig = {
	plugins: [sveltekit()],
	server: {
		port: 10311,
		host: true,
		strictPort: true
	},
	envPrefix: ['VITE_']
};

export default config;
