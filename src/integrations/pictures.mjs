// Vite 插件：只导入 src/data/*.yaml 里实际引用到的图片。
//
// 生成虚拟模块 `virtual:pictures`，内容是 { 'works/Aurora/OC3.jpg': <ImageMetadata>, ... }。
// Pictures/ 里没被 YAML 引用的图片不会被导入，也就不会出现在构建产物里。
// 引用了但文件不存在的路径不放进表里，由 src/lib/content.ts 给出中文报错。
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { load } from 'js-yaml';

const VIRTUAL = 'virtual:pictures';
const RESOLVED = '\0' + VIRTUAL;
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;

// 递归收集 YAML 里所有以图片扩展名结尾的字符串
function collect(node, out) {
	if (typeof node === 'string') {
		if (IMAGE.test(node)) out.add(node);
	} else if (Array.isArray(node)) {
		node.forEach((n) => collect(n, out));
	} else if (node && typeof node === 'object') {
		Object.values(node).forEach((n) => collect(n, out));
	}
}

export default function pictures() {
	let root = process.cwd();
	const dataDir = () => resolve(root, 'src/data');
	const picturesDir = () => resolve(root, 'Pictures');

	return {
		name: 'uestcyuri:pictures',
		configResolved(config) {
			root = config.root;
		},
		resolveId(id) {
			if (id === VIRTUAL) return RESOLVED;
		},
		load(id) {
			if (id !== RESOLVED) return;
			const refs = new Set();
			for (const file of readdirSync(dataDir())) {
				if (!/\.ya?ml$/.test(file)) continue;
				const full = join(dataDir(), file);
				this.addWatchFile(full);
				try {
					collect(load(readFileSync(full, 'utf-8')), refs);
				} catch {
					// YAML 语法错误交给 content.ts 报告
				}
			}
			const entries = [...refs].sort().filter((p) => existsSync(join(picturesDir(), p)));
			const imports = entries.map((p, i) => `import p${i} from ${JSON.stringify(join(picturesDir(), p))};`);
			const table = entries.map((p, i) => `  ${JSON.stringify(p)}: p${i},`);
			return `${imports.join('\n')}\nexport default {\n${table.join('\n')}\n};\n`;
		},
		// 开发模式：改了 YAML 或往 Pictures/ 里加了图，重新生成导入表
		hotUpdate({ file }) {
			if (!file.startsWith(dataDir() + sep) && !file.startsWith(picturesDir() + sep)) return;
			const mod = this.environment.moduleGraph.getModuleById(RESOLVED);
			if (mod) this.environment.moduleGraph.invalidateModule(mod);
		},
	};
}
