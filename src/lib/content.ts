import { load as parseYaml } from 'js-yaml';
import { z } from 'astro/zod';
import { hasPicture } from './images';

import siteRaw from '../data/site.yaml?raw';
import worksRaw from '../data/works.yaml?raw';
import translationsRaw from '../data/translations.yaml?raw';
import quotesRaw from '../data/quotes.yaml?raw';
import activitiesRaw from '../data/activities.yaml?raw';
import recommendationsRaw from '../data/recommendations.yaml?raw';
import contributorsRaw from '../data/contributors.yaml?raw';

// 图片路径：相对 Pictures/，构建时检查文件是否存在。
const picture = z.string().superRefine((path, ctx) => {
	if (!hasPicture(path)) ctx.addIssue({ code: 'custom', message: `找不到图片 Pictures/${path}（检查文件名和大小写）` });
});

const text = z.string({ error: '这里需要填写文字' }).min(1, { error: '不能为空' });
const link = z.object({ label: text, href: text });

const sectionIds = ['works', 'translations', 'quotes', 'activities', 'recommend', 'resources', 'about'] as const;

const site = z.object({
	name: text,
	subtitle: text,
	groupName: text,
	description: text,
	logo: picture,
	repo: z.url(),
	hero: z.object({
		eyebrow: text,
		title: z.array(text).min(1),
		intro: text,
		primary: link,
		secondary: link,
		image: picture,
		imageAlt: text,
		imageAuthor: text,
		imageLabel: text,
		vertical: text,
		caption: text,
	}),
	strip: z.object({ left: text, right: text }),
	pages: z.array(z.object({
		id: text.regex(/^[a-z][a-z0-9-]*$/, '网址只能使用小写字母、数字和连字符'),
		title: text,
		en: text,
		intro: text,
		sections: z.array(z.enum(sectionIds)).min(1),
	})).min(1),
	sections: z.array(
		z.object({
			id: z.enum(sectionIds),
			title: text,
			tagline: text.optional(),
			en: text,
			more: text.optional(),
		}),
	),
	resources: z.object({ emptyTitle: text, emptyNote: text }),
	about: z.object({ title: z.array(text).min(1), body: text, note: text.optional() }),
	footer: z.object({ copyright: text, signoff: text }),
}).superRefine((data, ctx) => {
	const pageIds = new Set<string>();
	const configuredSections = new Set<string>();
	data.sections.forEach((section, i) => {
		if (configuredSections.has(section.id)) ctx.addIssue({ code: 'custom', path: ['sections', i, 'id'], message: '板块 id 不能重复' });
		configuredSections.add(section.id);
	});
	data.pages.forEach((page, i) => {
		if (pageIds.has(page.id)) ctx.addIssue({ code: 'custom', path: ['pages', i, 'id'], message: '页面 id 不能重复' });
		pageIds.add(page.id);
		const seen = new Set<string>();
		page.sections.forEach((id, j) => {
			if (!configuredSections.has(id) || seen.has(id)) ctx.addIssue({ code: 'custom', path: ['pages', i, 'sections', j], message: '板块需要在 sections 中配置，且同一页面内不能重复' });
			seen.add(id);
		});
	});
});

export const workTypes = { illust: '插画', oc: '原创角色', text: '文字' } as const;

const works = z.array(
	z.object({
		name: text,
		avatar: picture,
		license: text.default('CC BY-NC-ND 4.0 · 禁止 AI 训练'),
		works: z
			.array(
				z.object({
					image: picture,
					type: z.enum(Object.keys(workTypes) as [keyof typeof workTypes], { error: `type 只能是 ${Object.keys(workTypes).join(' / ')}` }),
					note: text.optional(),
				}),
			)
			.min(1),
	}),
);

const translations = z.array(
	z.object({
		name: text,
		avatar: picture.optional(),
		platform: text,
		url: z.url().optional(),
		note: text.optional(),
	}),
);

const quotes = z.array(z.object({ text: text, author: text }));

// YAML 会把 2026-05-03 解析成 Date；写成字符串也接受。
const date = z.union([z.date(), z.string()]).transform((v, ctx) => {
	const d = v instanceof Date ? v : new Date(v);
	if (Number.isNaN(d.getTime())) {
		ctx.addIssue({ code: 'custom', message: `日期格式不对：${String(v)}，请写成 2026-05-03` });
		return z.NEVER;
	}
	return d;
});

const activities = z.array(
	z.object({
		title: text,
		date,
		intro: text,
		details: z.array(z.object({ label: text, value: text })).default([]),
		shots: z.array(picture).min(1),
	}),
);

const book = z.object({
	title: text,
	type: text,
	cover: z.union([picture, z.array(picture).min(1)]).optional(),
	coverText: text.optional(),
	coverSub: text.optional(),
	blurb: text,
	tags: z.array(text).default([]),
});

const recommendations = z.object({
	groups: z.array(
		z.object({
			title: text,
			en: text,
			wide: z.boolean().default(false),
			shelves: z.array(z.object({ title: text, note: text.optional(), items: z.array(book).min(1) })),
		}),
	),
});

const name = z.union([text, z.object({ org: text.optional(), name: text })]).transform((v) =>
	typeof v === 'string' ? { name: v, org: undefined } : v,
);

const contributors = z.object({
	roles: z.array(z.object({ role: text, en: text, note: text.optional(), names: z.array(name).min(1) })),
	materials: z.object({
		role: text,
		en: text,
		note: text.optional(),
		caption: text.optional(),
		people: z.array(z.object({ name: text, avatar: picture })),
	}),
});

function load<T extends z.ZodType>(file: string, raw: string, schema: T): z.output<T> {
	let data: unknown;
	try {
		data = parseYaml(raw);
	} catch (e) {
		throw new Error(`src/data/${file} 不是合法的 YAML：${(e as Error).message}`);
	}
	const result = schema.safeParse(data);
	if (!result.success) {
		// 路径写成人能看懂的样子：数组下标从 1 开始，例如「第1项 → works → 第2项 → image」
		const where = (path: PropertyKey[]) =>
			path.map((k) => (typeof k === 'number' ? `第${k + 1}项` : String(k))).join(' → ') || '(整个文件)';
		const lines = result.error.issues.map((i) => `  - ${where(i.path)}：${i.message}`);
		throw new Error(`src/data/${file} 有问题：\n${lines.join('\n')}`);
	}
	return result.data;
}

export const siteData = load('site.yaml', siteRaw, site);
export const worksData = load('works.yaml', worksRaw, works);
export const translationsData = load('translations.yaml', translationsRaw, translations);
export const quotesData = load('quotes.yaml', quotesRaw, quotes);
export const activitiesData = load('activities.yaml', activitiesRaw, activities).sort(
	(a, b) => b.date.getTime() - a.date.getTime(),
);
export const recommendationsData = load('recommendations.yaml', recommendationsRaw, recommendations);
export const contributorsData = load('contributors.yaml', contributorsRaw, contributors);

export type Section = z.output<typeof site>['sections'][number];

export type Page = z.output<typeof site>['pages'][number];
