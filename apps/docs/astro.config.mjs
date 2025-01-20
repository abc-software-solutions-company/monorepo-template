// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Monorepo Docs',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Deploy staging environment guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Guides 2',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Deploy staging environment guide', slug: 'guides-2/example' },
					],
				},
			],
		}),
	],
});
