declare module 'virtual:pictures' {
	// 由 src/integrations/pictures.mjs 生成：图片路径（相对 Pictures/）→ 图片元数据
	const pictures: Record<string, import('astro').ImageMetadata>;
	export default pictures;
}
