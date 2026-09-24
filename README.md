# 电♥百

**电子科技大学百合 ACG 交流群的作品展示页。**

「电」指成电（电子科技大学），「百」指百合。网站按栏目分为多个页面，展示群友自己画的、译的、说过的、一起玩过的，以及我们想推荐给你的百合作品。

![电♥百 首页（桌面端与手机端）](docs/images/preview.png)

<sub>截图中的插画 © Aurora，采用 CC BY-NC-ND 4.0，禁止用于 AI 训练。</sub>

## 页面上有什么

| 页面 | 地址 | 内容 |
|---|---|---|
| 首页 | `/` | 原有首屏与五个栏目入口 |
| 群友创作 | `/creations/` | 群友作品、汉化资源；后续可扩展游戏、小说等板块 |
| 活动记录 | `/activities/` | 群友金句、线上线下活动记录 |
| 百合推荐 | `/recommendations/` | 漫画、小说和游戏推荐 |
| 资源整理 | `/resources/` | 暂无内容，显示空状态 |
| 关于我们 | `/about/` | 群介绍与网页贡献者名单 |

各页面内部仍然垂直滚动，共用导航、页脚与原有视觉样式。旧首页的 `#works`、`#quotes` 等锚点链接会在浏览器中转到对应新页面。

这个网站**只做展示**，不提供入群方式，不放群号或二维码，也不使用学校标识。本群不是学校注册的社团。

## 想改内容？

页面上所有会变的内容都写在 `src/data/` 下的 YAML 文件里，一个板块一个文件，文件开头有注释说明怎么写。改文字、加作品、加活动都**不用碰代码**。

| 想改什么 | 改哪个文件 |
|---|---|
| 标题、首屏、栏目导航与板块归属、资源空状态、关于我们、页脚 | `src/data/site.yaml` |
| 群友作品 | `src/data/works.yaml` |
| 群友汉化 | `src/data/translations.yaml` |
| 群友金句 | `src/data/quotes.yaml` |
| 群友活动 | `src/data/activities.yaml` |
| 百合推荐 | `src/data/recommendations.yaml` |
| 网页贡献者 | `src/data/contributors.yaml` |

图片放在根目录的 `Pictures/` 里，YAML 里写相对路径即可，例如 `works/Aurora/OC3.jpg`。构建时会自动压缩成 webp。

仓库不开放直接推送，所有改动都通过 **Pull Request** 提交，由维护者审核合并进 `main` 后自动上线。只改几个字的话，可以直接在 GitHub 网页上编辑文件，GitHub 会自动帮你提 PR。

想参与的话先看 **[运维指南](docs/maintenance.md)**，里面有从素材到上线的完整流程；每个 YAML 字段怎么写、常见操作和注意事项见 **[docs/editing.md](docs/editing.md)**。

### 几条规矩

- **金句**：必须先征得本人同意，记录在 [`docs/group_quotes.md`](docs/group_quotes.md)，然后再加进 YAML。
- **图片**：只有已确认可以公开的图片才放进 `Pictures/`，这个目录会随仓库公开。还没发布、或者还没征得同意的素材放在 `Raw_image_materials/`，这个目录不会提交。
- **署名**：只写群昵称，不放联系方式或个人主页。

## 本地运行

需要 Node.js 22.12.0 或更新版本。

```sh
npm install
npm run astro -- dev --background   # 启动开发服务器（后台运行），默认 http://localhost:4321
```

开发服务器运行时，改完 YAML 刷新页面就能看到效果。管理后台服务器：

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

其他命令：

| 命令 | 作用 |
|---|---|
| `npm run build` | 构建到 `dist/`。YAML 写错会在这一步报错，并指出哪个文件、第几项、错在哪 |
| `npm run preview` | 构建后用 Wrangler 在本地预览 |
| `npm run deploy` | 手动构建并部署到 Cloudflare（平时不需要，合并进 `main` 会自动部署） |
| `npx astro check` | 类型检查 |

## 技术说明

- **[Astro](https://astro.build) 静态站点**：构建产物是纯 HTML/CSS/JS 加压缩后的图片，部署在 Cloudflare Workers：`main` 有新提交时由 Workers Builds 自动构建发布，配置见 `wrangler.jsonc`。
- **内容与代码分离**：`src/lib/content.ts` 在构建时读取并校验 YAML，写错时给出中文报错。
- **图片白名单**：`src/integrations/pictures.mjs` 只导入 YAML 里实际引用到的图片，`Pictures/` 里没被引用的图不会进入构建产物。页面只使用压缩后的版本。
- **没有框架和追踪**：页面交互（菜单、筛选、大图浏览、滚动动效）是一个很小的原生 TypeScript 脚本，不引入前端框架，也不做访问统计。
- **无障碍**：尊重系统的「减少动态效果」设置，支持键盘操作，手机和桌面都适配。

### 目录

| 路径 | 内容 |
|---|---|
| `src/data/` | 页面内容（YAML） |
| `src/pages/index.astro` | 首页首屏与栏目入口 |
| `src/pages/[page].astro` | 按 `site.yaml` 的 `pages` 生成栏目页面，按各栏目的 `sections` 拼装内容 |
| `src/layouts/Layout.astro` | 页面外壳：`<head>`、爱心图标、大图浏览层 |
| `src/components/` | 各板块组件 |
| `src/lib/` | 读取和校验数据、图片解析 |
| `src/integrations/pictures.mjs` | 图片白名单插件 |
| `src/styles/global.css` | 全站样式，配色和字体在开头的 `:root` 里 |
| `src/scripts/site.ts` | 页面交互 |
| `Pictures/` | 已确认公开的图片 |
| `public/` | 原样发布的文件：`robots.txt`、`favicon.svg` |
| `.github/pull_request_template.md` | 提 PR 时自动带出的说明模板和检查清单 |
| `docs/` | 维护说明、许可、资料整理、已知问题 |
| `demo_claude/` | 静态设计示例，直接双击打开 |

### 文档

| 文件 | 内容 |
|---|---|
| [`docs/maintenance.md`](docs/maintenance.md) | 运维指南：从素材到上线的流程、检查清单、出错怎么办、定期维护 |
| [`docs/editing.md`](docs/editing.md) | 怎么改网页内容 |
| [`docs/claude_recommendation.md`](docs/claude_recommendation.md) | 页面结构和文案的设计决定 |
| [`docs/artwork_license.md`](docs/artwork_license.md) | 群友原创图片的许可 |
| [`docs/yuri_artworks.md`](docs/yuri_artworks.md) | 推荐作品的完整资料和核实记录 |
| [`docs/translation_works.md`](docs/translation_works.md) | 群友汉化记录 |
| [`docs/group_quotes.md`](docs/group_quotes.md) | 金句征集与同意记录 |
| [`docs/known_issues.md`](docs/known_issues.md) | 已知但暂时不修的问题 |

## 许可

这个仓库里的内容分几种许可，请注意区分：

| 内容 | 许可 |
|---|---|
| 网页源码（HTML、CSS、JS、Astro 组件和配置） | [MIT](LICENSE) |
| 群友原创图片（`Pictures/works/`） | [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans)，另外**禁止用于 AI 训练**，详见 [`docs/artwork_license.md`](docs/artwork_license.md) |
| 推荐作品的封面（`Pictures/manga_cover/`、`Pictures/game_cover/`） | 版权归原出版方，仅用于介绍 |
| Logo 和群友头像 | 不在 MIT 许可范围内，版权归各自所有者 |

MIT 许可**只覆盖源码**。群友的画可以署名后原样转发，但不能修改、不能商用、不能拿去训练 AI。

## 贡献者

- **开发与设计**：HZ-TYZQ & Anthropic Claude
- **内容整理**：HZ-TYZQ & Anthropic Claude & OpenAI ChatGPT
- **素材提供**：Aurora、冬之雪、柴猫猫、古明地道战、HZ-TYZQ

名单以页面页脚和 `src/data/contributors.yaml` 为准。
