// 页面交互：菜单、作品筛选、大图浏览、滚动动效、头像轮播。
// 内容都已在构建时渲染好，这里只加行为。

export {}; // 让这个文件成为模块，避免变量和 window 上的全局名冲突

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

// 窄屏菜单
const toggle = $<HTMLButtonElement>('.menu-toggle')!;
const nav = $('#site-nav')!;
const setOpen = (open: boolean) => {
	nav.classList.toggle('open', open);
	toggle.setAttribute('aria-expanded', String(open));
	toggle.textContent = open ? '关闭' : '目录';
};
toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => {
	if ((e.target as Element).closest('a')) setOpen(false);
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && nav.classList.contains('open')) {
		setOpen(false);
		toggle.focus();
	}
});

// 作品筛选：分类按钮在构建时按实际作品生成，少于两类时不渲染
const filters = $$<HTMLButtonElement>('.filter');
const works = $$('.work');
const status = $('.filter-status');
const empty = $('.filter-empty');
filters.forEach((btn) =>
	btn.addEventListener('click', () => {
		const f = btn.dataset.filter;
		filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
		let shown = 0;
		works.forEach((w) => {
			const ok = f === 'all' || w.dataset.type === f;
			w.hidden = !ok;
			w.classList.remove('pop');
			if (ok) {
				w.style.setProperty('--i', String(shown++));
				void w.offsetWidth;
				w.classList.add('pop');
			}
		});
		$$('.author').forEach((a) => (a.hidden = !a.querySelector('.work:not([hidden])')));
		if (empty) empty.hidden = shown > 0;
		if (status) status.textContent = `共 ${shown} 件作品`;
	}),
);

// 大图浏览：data-gallery 相同的按钮为一组
const lb = $<HTMLDialogElement>('.lightbox')!;
const lbImg = $<HTMLImageElement>('img', lb)!;
let group: HTMLElement[] = [];
let idx = 0;
const show = (i: number) => {
	idx = (i + group.length) % group.length;
	const b = group[idx];
	lbImg.src = b.dataset.full ?? '';
	lbImg.alt = $<HTMLImageElement>('img', b)?.alt ?? '';
	$('.lb-count', lb)!.textContent = `${idx + 1} / ${group.length}`;
	$('.lb-title', lb)!.textContent = b.dataset.caption ?? '';
	$('.lb-note', lb)!.textContent = b.dataset.note ?? '';
	lbImg.style.animation = 'none';
	void lbImg.offsetWidth;
	lbImg.style.animation = '';
};
$$('[data-gallery]').forEach((b) =>
	b.addEventListener('click', () => {
		group = $$(`[data-gallery="${b.dataset.gallery}"]`).filter((x) => !x.closest('[hidden]'));
		show(group.indexOf(b));
		lb.showModal();
	}),
);
$('.lb-prev', lb)!.addEventListener('click', () => show(idx - 1));
$('.lb-next', lb)!.addEventListener('click', () => show(idx + 1));
$('.lb-close', lb)!.addEventListener('click', () => lb.close());
lb.addEventListener('click', (e) => {
	const t = e.target as Element;
	if (t === lb || t.classList.contains('lb-stage')) lb.close();
});
lb.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowLeft') show(idx - 1);
	if (e.key === 'ArrowRight') show(idx + 1);
});

// 原创图片不提供右键另存与拖拽（只是提醒，不是保护）
$$<HTMLImageElement>('.work img, .hero-art img, .lightbox img').forEach((img) => {
	img.draggable = false;
	img.addEventListener('contextmenu', (e) => e.preventDefault());
});

// 占位块的流光
$$('.ph').forEach((el) => {
	const s = document.createElement('span');
	s.className = 'shine';
	s.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
	el.prepend(s);
});

// ?still 用于截图：图片立即加载
if (/[?&]still\b/.test(location.search)) {
	$$<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
}

// 滚动进度条；主导航的当前页面由服务端标记，不随页内滚动改变。
const bar = $('.progress')!;
let ticking = false;
const onScroll = () => {
	ticking = false;
	const max = document.documentElement.scrollHeight - innerHeight;
	bar.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : '0');
};
addEventListener(
	'scroll',
	() => {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(onScroll);
		}
	},
	{ passive: true },
);
onScroll();
addEventListener('resize', onScroll);

// 头像轮播：复制一份接成无缝循环，时长随人数增加
$$('.reel-track').forEach((track) => {
	const items = [...track.children];
	items.forEach((li) => {
		const c = li.cloneNode(true) as Element;
		c.setAttribute('aria-hidden', 'true');
		track.append(c);
	});
	track.style.setProperty('--reel-dur', `${Math.max(12, items.length * 4.5)}s`);
});

if (document.documentElement.classList.contains('motion')) {
	// 滚动出现：同组元素依次错开
	const groups = [
		'.section-head', '.sub-head', '.shelf-title', '.filters', '.license',
		'.authors > .author', '.gallery > .work', '.tl-list > li', '.quotes > .quote',
		'.activity > *', '.books > .book', '.about-inner > *', '.footer-main',
		'.credits-head', '.credits-roll > .credit', '.credits-end',
		'.directory-item',
	];
	// 栏目页首屏里的内容已由 CSS 进场动画带出，这里不再重复
	const onFirstScreen = (el: Element) => !!el.closest('.page-content') && el.getBoundingClientRect().top < innerHeight;
	groups.forEach((sel) =>
		$$(sel).forEach((el) => {
			// 仍加上 in，让标题编号、分隔线这类挂在 in 上的细节照常出现
			if (onFirstScreen(el)) return void el.classList.add('in');
			el.classList.add('reveal');
			const sibs = [...el.parentElement!.children].filter((c) => c.matches(sel));
			el.style.setProperty('--i', String(sibs.indexOf(el) % 4));
		}),
	);
	const io = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				const el = e.target;
				el.classList.add('in');
				io.unobserve(el);
				// 出现后撤掉 reveal，让元素回到自己的 hover 过渡
				if (!el.matches('.section-head, .authors > .author, .gallery > .work')) {
					el.addEventListener('transitionend', function done(ev) {
						if (ev.target !== el || (ev as TransitionEvent).propertyName !== 'transform') return;
						el.classList.remove('reveal', 'in');
						el.removeEventListener('transitionend', done);
					});
				}
			}),
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
	);
	$$('.reveal').forEach((el) => io.observe(el));

	if (matchMedia('(pointer: fine)').matches) {
		// 首屏卡片跟随指针
		const hero = $('.hero');
		const art = $('.hero-art');
		hero?.addEventListener('pointermove', (e) => {
			if (!art) return;
			const r = art.getBoundingClientRect();
			art.style.setProperty('--mx', ((e.clientX - (r.left + r.width / 2)) / r.width).toFixed(3));
			art.style.setProperty('--my', ((e.clientY - (r.top + r.height / 2)) / r.height).toFixed(3));
		});
		hero?.addEventListener('pointerleave', () => {
			if (!art) return;
			art.style.setProperty('--mx', '0');
			art.style.setProperty('--my', '0');
		});

		// 金句卡片轻微倾斜
		$$('.quote').forEach((q) => {
			q.addEventListener('pointermove', (e) => {
				const r = q.getBoundingClientRect();
				q.style.setProperty('--rx', `${((e.clientX - r.left) / r.width - 0.5) * 6}deg`);
				q.style.setProperty('--ry', `${(0.5 - (e.clientY - r.top) / r.height) * 6}deg`);
			});
			q.addEventListener('pointerleave', () => {
				q.style.setProperty('--rx', '0deg');
				q.style.setProperty('--ry', '0deg');
			});
		});
	}
}
