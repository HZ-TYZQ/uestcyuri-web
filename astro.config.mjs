// @ts-check
import { defineConfig } from 'astro/config';
import pictures from './src/integrations/pictures.mjs';

// https://astro.build/config
export default defineConfig({
	vite: {
		// 只导入 src/data 里引用到的图片，未引用的不会进入构建产物
		plugins: [pictures()],
	},
});
