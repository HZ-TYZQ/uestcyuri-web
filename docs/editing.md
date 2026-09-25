## 怎么改网页内容

从拿到素材到上线的整体流程、提交前的检查清单和出错排查，见 [maintenance.md](maintenance.md)。本文只讲每一项内容怎么写。

页面上会变的内容都在 `src/data/` 里，一个板块一个 YAML 文件，每个文件开头都有注释说明怎么写。改内容只需要改这些文件，不用碰代码。

| 想改什么 | 改哪个文件 |
|---|---|
| 标题、首屏、栏目导航与板块归属、资源空状态、关于我们、页脚 | `src/data/site.yaml` |
| 群友作品（作者、作品图、分类） | `src/data/works.yaml` |
| 群友汉化 | `src/data/translations.yaml` |
| 群友金句 | `src/data/quotes.yaml` |
| 群友活动 | `src/data/activities.yaml` |
| 资源整理的小工具列表 | `src/data/resources.yaml` |
| 百合推荐（漫画、小说、游戏） | `src/data/recommendations.yaml` |
| 网页贡献者、素材提供头像轮播 | `src/data/contributors.yaml` |
| 配色、字体 | `src/styles/global.css` 开头的 `:root` |

### 图片

- 已确认公开的图片放在根目录的 `Pictures/` 里，YAML 里写相对 `Pictures/` 的路径，例如 `works/Aurora/OC3.jpg`。
- 构建时 Astro 会自动压缩成 webp、生成多种尺寸，原图多大都没关系。
- 路径写错会直接构建失败，并告诉你是哪个文件、第几项、找不到哪张图。
- 网站构建只包含被 YAML 引用的图片，页面使用自动压缩后的版本。`Pictures/` 中的原图会随 Git 提交，在公开仓库中也能访问；构建白名单不控制仓库文件的公开范围。
- 未发布或尚未获授权的素材放在 `Raw_image_materials/`，该目录被 `.gitignore` 忽略。确认公开后，再移到 `Pictures/` 并添加 YAML 引用。

| 图片 | 放在 |
|---|---|
| 群友作品 | `Pictures/works/<作者>/` |
| 头像 | `Pictures/head/` |
| 活动截图 | `Pictures/activities/<活动>/` |
| 漫画、小说封面 | `Pictures/manga_cover/` |
| 游戏封面 | `Pictures/game_cover/` |
| Logo | `Pictures/logo/` |

`Pictures/` 随仓库一起提交，新电脑克隆仓库并安装依赖后即可构建。添加图片时，记得同时提交图片文件和对应的 YAML 改动。

### 常见操作

**加一位作者的作品**：图片放进 `Pictures/works/<作者>/`，头像放进 `Pictures/head/`，在 `works.yaml` 末尾照格式加一项。作品的 `type` 出现第二种时，筛选按钮会自动出现。

**加一条金句**：先在 `docs/group_quotes.md` 里确认本人同意公开，再加到 `quotes.yaml`。一条时整行大号展示，多条自动排成卡片。

**加一场活动**：截图放进 `Pictures/activities/<活动>/`，在 `activities.yaml` 里加一项。页面按日期自动倒序排列，不用管顺序。

**加一部推荐作品**：在 `recommendations.yaml` 对应的书架里加一项。没有封面就不写 `cover`，会自动生成竖排文字封面。

**加一位素材提供者**：头像放进 `Pictures/head/`，在 `contributors.yaml` 里「素材提供」那条 `reels` 的 `people` 里加一行，轮播会自动接上。网页维护同理，加在「网页维护」那条里。

**调整栏目和板块**：`site.yaml` 的 `pages` 决定主导航和首页入口的顺序，每项的 `id` 对应 `/<id>/` 网址，`title`、`en`、`intro` 是栏目文案。每个栏目的 `sections` 列表决定页面内的板块和顺序，罗马数字在每页从 I 开始。板块标题与导语在顶层 `sections` 修改，板块 `id` 不要改。

**作品台词引用**：栏目可加 `quote`（`text` 写中文译文，`from` 写出处作品名，不带书名号），显示在栏目导语下方；`creditsQuote` 同样格式，显示在贡献者名单末尾；页脚 `signoff` 若是台词，可加 `signoffFrom` 注明出处。三者都可省略。

各栏目页按内容自然垂直滚动，通过顶部主导航切换栏目。页面不设置页内目录，也不为末节跳转补足视口高度。

**添加小工具**：把单文件 HTML 放进 `public/resources/tools/`，文件名使用小写英文、数字和连字符，例如 `my-tool.html`。它会直接发布为 `/resources/tools/my-tool.html`，可以单独打开、刷新或分享，不需要先访问资源页。

在 `src/data/resources.yaml` 的 `tools.items` 末尾添加：

```yaml
- file: my-tool.html
  title: 工具名称
  description: 简短说明工具能做什么。
  tags: [标签一, 标签二]
```

列表顺序与 YAML 一致；`tools.title`、`tools.en`、`tools.intro` 控制“小工具”栏目的标题和导语。工具文件原样发布，保持各自的样式和脚本；新增或更新时直接替换对应 HTML 即可。构建时会校验文件是否存在、文件名是否重复。金句工具现位于 `public/resources/tools/quotes.html`，网址为 `/resources/tools/quotes.html`。

**工具页的返回入口**：每个 HTML 的 `<head>` 中加入下面这一行，自动在页面顶部显示共用的“返回资源整理”导航条：

```html
<script src="../tool-navigation.js" defer></script>
```

导航条使用工具现有的 `--accent`、`--line`、`--muted` 等配色变量，内部样式通过 Shadow DOM 隔离，不影响工具的按钮、标题或布局。返回目标固定为 `/resources/#resources`，直接访问工具网址也能返回。若工具按视口高度布局，可在高度计算里减去 `var(--tool-navigation-height, 0px)`；普通文档布局无需调整。共用脚本位于 `public/resources/tool-navigation.js`，后续统一修改这里即可。

工具列表为空（`items: []`）时显示空状态；空状态文案仍在 `site.yaml` 的 `resources.emptyTitle` 和 `resources.emptyNote` 中修改。

**新增创作类型**：已有的插画、原创角色和图片形式文字作品继续改 `works.yaml`；如果后续要展示可玩的游戏或小说正文，可添加专用数据文件与组件，在 `src/lib/content.ts` 注册板块 id 和校验，再在 `src/pages/[page].astro` 注册组件，最后加入 `pages` 中“群友创作”的 `sections`。无需改动其他页面。

**贡献者名单**：仍在 `contributors.yaml` 修改，显示在“关于我们”页面。

### 改完之后

```sh
npm run astro -- dev --background   # 本地预览，改 YAML 后刷新即可看到
npm run build                        # 构建，数据写错会在这一步报错
```

不需要手动部署：PR 合并进 `main` 后，Cloudflare 会自动构建上线。

YAML 的几个小坑：

- 缩进只能用空格，不能用 Tab。
- 内容里有英文冒号 `: ` 或以 `#` 开头时，用双引号把整段包起来。
- 列表项前面是 `- `，横线后要有空格。
- 写在花括号 `{ ... }` 里的一行，内容里不能有英文逗号 `,`。逗号会被当成分隔符，后面的文字会被悄悄丢掉，构建也不报错（见 `known_issues.md`）。用中文逗号「，」，或者用双引号把那一项的值包起来。
