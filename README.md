# 电子科技大学百合ACG交流群/展示页 · 花间来信

电子科技大学百合 ACG 交流群的作品展示页，单页，包含群友作品、汉化、金句、活动、百合推荐和关于我们。

- **内容**：都在 `src/data/*.yaml` 里，改内容不用碰代码，具体见 [`docs/editing.md`](docs/editing.md)。
- **图片**：已确认公开的图片放在根目录的 `Pictures/` 里，随仓库提交，构建时自动压缩。未发布或尚未获授权的素材放在不入库的 `Raw_image_materials/` 里。

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

## 目录

| 路径 | 内容 |
|---|---|
| `src/data/` | 页面内容（YAML） |
| `src/components/` | 各板块组件 |
| `src/lib/content.ts` | 读取并校验 YAML，写错时给出中文报错 |
| `src/integrations/pictures.mjs` | 只导入 YAML 里引用到的图片，其余图片不进构建产物 |
| `src/styles/global.css` | 全站样式 |
| `src/scripts/site.ts` | 页面交互 |
| `demo_claude/` | 静态设计示例（`index.html` 占位版、`release.html` 发布预览版） |

## 设计文件

`design-demos/` 保留三版设计稿 HTML、截图与设计说明，`direction-approved.md` 记录选定方向。

## 许可

- **网页源码**：[MIT](LICENSE)。
- **群友原创图片**：CC BY-NC-ND 4.0，另外禁止用于 AI 训练，详见 [`docs/artwork_license.md`](docs/artwork_license.md)。
- **推荐作品封面**：版权归原出版方，仅用于介绍。
- **Logo 和群友头像**：不在 MIT 许可范围内。
