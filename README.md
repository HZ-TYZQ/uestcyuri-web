# 电子科技大学百合社 · 花间来信

基于 Astro 的社团展示单页，包含活动介绍、作品分类筛选与社团简介。采用已选定的 C「花间来信」设计，支持桌面和手机浏览。

## 本地开发

需要 Node.js 22.12.0 或更新版本。

```sh
npm install
npm run astro -- dev --background
```

打开终端提供的地址（默认 http://localhost:4321）。管理后台开发服务器：

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

构建使用 `npm run build`。`npm run preview` 构建后通过 Wrangler 预览；`npm run deploy` 是手动部署命令。

## 更新内容与图片

统一编辑 `src/data/club.ts`：

- `club`：社团名称、介绍、联系方式与首屏封面 `heroImage`。
- `activities`：第一项是重点活动，后续项显示为文字栏目，可选添加海报。
- `works`：作品标题、分类、摘要、封面与可选文字摘录。
- `isExample`：真实活动或作品填好后改为 `false`，移除该项的示例标记。

图片放到 `public/images/`（首次使用时创建目录），在对应项目填写：

```ts
image: {
  src: '/images/your-cover.webp',
  alt: '描述图片中呈现的内容',
},
```

首屏图片填入 `club.heroImage`。未填图片时保留现有占位。首屏封面按原比例完整显示，海报和作品封面裁切填满各自预留区域；替换图片不会改变区域尺寸。文字作品没有图片时显示 `excerpt` 摘录，填入图片后优先展示封面。

当前活动和作品均为示例，图片与联系方式待补充。

## 设计文件

`design-demos/` 保留三版独立 HTML 与截图，`direction-approved.md` 记录用户选择。通过 `/design-preview/index.html` 查看原始方向对比；正式首页在 `/`。

选定稿的样式位于 `src/styles/site.css`，交互位于 `src/scripts/home.ts`。页面采用 Astro 组件与原生 JavaScript，没有前端框架或后端服务。
