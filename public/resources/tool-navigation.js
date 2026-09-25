// 单 HTML 工具共用的返回入口。用 defer 引入，样式通过 Shadow DOM 与工具隔离。
(() => {
  function mount() {
    if (document.querySelector('uestcyuri-tool-navigation')) return;
    const host = document.createElement('uestcyuri-tool-navigation');
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--paper, transparent);
          color: inherit;
          font-family: inherit;
          border-bottom: 1px solid var(--line, #e4e1dc);
        }
        * { box-sizing: border-box; }
        nav {
          display: flex;
          align-items: center;
          gap: 16px;
          min-height: 44px;
          padding: 0 clamp(16px, 3vw, 36px);
          padding-top: env(safe-area-inset-top, 0px);
          font-size: 12px;
          line-height: 1.5;
        }
        a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          color: inherit;
          text-decoration: none;
          white-space: nowrap;
          transition: color .2s;
        }
        svg { width: 16px; height: 16px; color: var(--accent, #e3809c); transition: transform .2s; }
        a:hover { color: var(--accent, #e3809c); }
        a:hover svg { transform: translateX(-3px); }
        a:focus-visible { outline: 2px solid var(--accent, #e3809c); outline-offset: 2px; border-radius: 2px; }
        .section { border-left: 1px solid var(--line, #e4e1dc); padding-left: 16px; color: var(--muted, #6f6b65); }
        @media (prefers-reduced-motion: reduce) { a, svg { transition: none; } }
        @media print { :host { display: none; } }
      </style>
      <nav aria-label="工具导航">
        <a href="/resources/#resources">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 5-7 7 7 7M3 12h18" /></svg>
          <span>返回资源整理</span>
        </a>
        <span class="section">小工具</span>
      </nav>`;
    document.body.prepend(host);
    // 全屏工具可以在高度计算中扣除此变量，避免多出一段滚动距离。
    const syncHeight = () => document.documentElement.style.setProperty('--tool-navigation-height', `${host.getBoundingClientRect().height}px`);
    syncHeight();
    new ResizeObserver(syncHeight).observe(host);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
