import type { ImageMetadata } from 'astro';
import pictures from 'virtual:pictures';

// Pictures/ 在仓库根目录，存放随仓库提交的公开图片；数据文件里的图片路径都相对于它来写。
// 导入表由 src/integrations/pictures.mjs 生成，只包含 src/data 里实际引用到的图片。

export function hasPicture(path: string): boolean {
	return path in pictures;
}

export function pic(path: string): ImageMetadata {
	const hit = pictures[path];
	if (!hit) {
		throw new Error(`找不到图片 Pictures/${path}。检查 src/data 里写的路径、文件名和大小写。`);
	}
	return hit;
}
