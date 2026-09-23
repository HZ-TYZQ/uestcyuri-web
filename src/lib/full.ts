import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// 点开大图时用的尺寸：最长边不超过 2000px，转成 webp。
export async function fullSize(img: ImageMetadata): Promise<string> {
	// 直接读 img.width 会让 Astro 以为原图还要用，把全尺寸原图也发布出去；
	// 通过 clone 读取尺寸不会触发这个标记（Astro 内部也是这样读的）。
	const { width, height } = (img as ImageMetadata & { clone: ImageMetadata }).clone;
	const scale = Math.min(1, 2000 / Math.max(width, height));
	const out = await getImage({ src: img, width: Math.floor(width * scale), format: 'webp' });
	return out.src;
}
