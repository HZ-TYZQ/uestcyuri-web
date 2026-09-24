# 运维指南

写给想往网站里加东西、或者帮忙维护网站的群友。

每一项具体怎么写（YAML 格式、字段含义）请看 [editing.md](editing.md)。这份指南只讲流程：从拿到素材到网站上线要做哪些事、出了问题怎么办。

---

## 先看你是哪种情况

### 不会用 Git，只想加点东西

把东西发给维护者（目前是 HZ-TYZQ），由维护者来加。发的时候带上下面这些信息：

| 想加什么 | 要准备 |
|---|---|
| 自己的画 | 原图；你的群昵称；头像（可选）；确认同意按 CC BY-NC-ND 4.0 + 禁止 AI 训练公开 |
| 汉化 | 你的群昵称；发布平台；链接，或者一句怎么找到 |
| 金句 | 原话；说话人的群昵称；**说话人本人同意公开** |
| 活动 | 活动名；日期；一句话介绍；几张截图 |
| 推荐作品 | 书名或游戏名；类型；一句话推荐理由；有封面最好 |

### 只改几个字

比如修错别字、改一句简介，直接在 GitHub 网页上改就行，不用装任何东西：

1. 在仓库里打开要改的文件，比如 `src/data/recommendations.yaml`。
2. 点右上角的铅笔图标（Edit this file）。
3. 改完点 **Commit changes…**。GitHub 会自动帮你 Fork 仓库，并引导你提交 Pull Request。PR 说明里的模板照着填就行，构建检查和手机预览那两项可以不勾，维护者会检查。

也可以用同样的方式上传图片：在 `Pictures/` 对应的文件夹里选 **Add file → Upload files**。不过加图片通常还要改 YAML，改动比较多时，建议用下面的方式。

### 会用 Git，想自己改

按下面的流程来。

> **所有改动都要通过 Pull Request（PR）提交。** 仓库不开放直接推送，维护者审核通过、合并之后，改动才会进入主分支。

---

## 第一次准备（只做一次）

1. 安装 [Node.js](https://nodejs.org/) 22.12.0 或更新版本。
2. 在 GitHub 上打开 <https://github.com/HZ-TYZQ/uestcyuri-web>，点右上角的 **Fork**，在自己的账号下复制一份仓库。
3. 下载**你自己的那份**，并安装依赖（把 `<你的用户名>` 换成你的 GitHub 用户名）：

   ```sh
   git clone https://github.com/<你的用户名>/uestcyuri-web.git
   cd uestcyuri-web
   git remote add upstream https://github.com/HZ-TYZQ/uestcyuri-web.git
   npm install
   ```

   这里的 `origin` 是你自己的 Fork，`upstream` 是原仓库。

---

## 改东西的流程

### 1. 同步最新版本，开一个新分支

```sh
git switch main
git pull upstream main          # 拿到原仓库的最新内容
git switch -c add-aurora-works  # 新分支，名字随便起，能看出在改什么就行
```

每件事单独开一个分支，一个 PR 只做一件事，维护者审核起来更快。

### 2. 放图片，改 YAML

- 图片放进 `Pictures/` 对应的文件夹。
- 内容写进 `src/data/` 对应的 YAML 文件。

怎么写见 [editing.md](editing.md)，每个 YAML 文件开头也有注释。

### 3. 本地预览

```sh
npm run astro -- dev --background
```

浏览器打开 http://localhost:4321 。改完 YAML 刷新页面就能看到效果。

**记得把浏览器窗口拉窄，看一眼手机版的效果。**

看完后关掉预览：

```sh
npm run astro -- dev stop
```

### 4. 构建检查

```sh
npm run build
```

**必须通过这一步。** YAML 写错时会在这里报错，报错会告诉你是哪个文件、第几项、错在哪。

### 5. 提交并推到你的 Fork

```sh
git add Pictures src/data
git commit -m "加上 Aurora 的新作品"
git push -u origin add-aurora-works
```

图片和 YAML 要放在同一个 PR 里。只提交了 YAML 没提交图片的话，构建会失败。

### 6. 提 Pull Request

1. 打开你 Fork 的 GitHub 页面，上方会出现 **Compare & pull request** 按钮，点它。
2. 确认合并方向是：你的分支 → `HZ-TYZQ/uestcyuri-web` 的 `main`。
3. 说明框里会自动带出模板，照着填：做了什么、素材来自谁，再把检查清单逐条勾上。清单和下面「提交前的检查清单」一样。
4. 点 **Create pull request**，等维护者审核。

维护者可能会在 PR 里留言，请你改一些地方。在同一个分支上继续改，再 `git push` 一次，PR 会自动更新，不用重新提。

### 7. 合并之后

维护者合并 PR 后，网站会自动更新。你可以删掉这个分支，下次改东西时从第 1 步重新开始：

```sh
git switch main
git pull upstream main
git branch -d add-aurora-works
```

---

## 上线

**PR 合并进 `main` 就会自动上线**，不需要手动部署。仓库接入了 Cloudflare Workers Builds：每次 `main` 有新提交，Cloudflare 都会自动构建并发布。PR 页面下方也会显示一项 `Workers Builds: uestcyuri-web` 检查，构建失败时这里会变红，合并前先看一眼。

合并后等几分钟，打开网站检查一遍：

- 新加的内容显示正常。
- 图片能点开看大图。
- 手机上看也正常。

**页面显示异常或还是旧内容，多半是缓存。** 这种情况出现过好几次，先按顺序排查：

1. 自己先强制刷新（`Ctrl + F5`，Mac 上 `Cmd + Shift + R`），或者用无痕窗口打开。
2. 还是旧的，就提醒维护者去 Cloudflare 后台清除缓存（Purge Everything），清完再刷新。

清完缓存还不对，在 PR 或 `main` 的最新提交上点开 `Workers Builds` 检查，看看构建日志。自动部署出问题时，有 Cloudflare 权限的维护者也可以在本地手动部署：

```sh
npx wrangler login   # 第一次部署前登录一次
npm run deploy       # 构建并上线
```

---

## 提交前的检查清单

- [ ] 金句已经征得本人同意，并记录在 [group_quotes.md](group_quotes.md)
- [ ] 新作者同意按 CC BY-NC-ND 4.0 + 禁止 AI 训练公开作品
- [ ] 只放已经确认可以公开的图片。没确认的素材放在 `Raw_image_materials/`，这个目录不会提交
- [ ] 只写群昵称，没有联系方式、QQ 号、个人主页
- [ ] 没有群号、二维码或其他入群方式
- [ ] `npm run build` 通过
- [ ] 手机宽度下看过一眼

---

## 出错了怎么办

| 看到的情况 | 原因和解决办法 |
|---|---|
| 构建报 `src/data/xxx.yaml 有问题` | 按报错里的位置去找，例如「第1项 → works → 第2项 → image」 |
| 构建报 `不是合法的 YAML` | 通常是缩进不对、用了 Tab，或者内容里有英文冒号 `: ` 却没加引号 |
| 构建报 `找不到图片` | 检查路径和文件名是否一致，包括大小写和扩展名（`.jpg` 和 `.JPG` 算两个不同的名字）；图片是不是放进了 `Pictures/` |
| 改了 YAML，页面上没变化 | 刷新页面；检查字段名有没有拼错；花括号 `{ }` 里有没有英文逗号。这两种错误构建时不会报，见 [known_issues.md](known_issues.md) |
| 预览服务器起不来，提示端口被占用 | 运行 `npm run astro -- dev status` 看看是不是已经开着；不需要的话用 `npm run astro -- dev stop` 关掉 |
| PR 里的 `Workers Builds` 检查失败 | 点开检查看构建日志，报错和本地 `npm run build` 的一样，按上面几行排查 |
| `npm run deploy` 提示没有登录 | 先运行 `npx wrangler login`；没有 Cloudflare 权限的话，找维护者部署 |
| PR 里提示有冲突（conflict） | 先同步原仓库再推一次：`git pull upstream main`，按提示解决冲突后 `git push`。搞不定就在 PR 里留言请维护者处理 |
| 网站上还是旧内容，或者样式错乱、图片缺失 | 多半是缓存。先强制刷新（`Ctrl + F5`）或换无痕窗口；还不行就提醒维护者在 Cloudflare 后台清除缓存 |
| 上线后发现有问题，想撤回 | 告诉维护者。维护者用 `git revert` 撤回那次合并，推送到 `main` 后会自动重新部署 |

实在搞不定，就把报错信息截图发到群里问维护者。

---

## 定期维护

| 多久一次 | 做什么 |
|---|---|
| 每季度 | 更新百合推荐的「新连载速递」：改 `recommendations.yaml`，资料同步到 [yuri_artworks.md](yuri_artworks.md) |
| 每学期 | 点一遍页面上的外链（主要是汉化链接），打不开的找本人要新地址 |
| 有人提出时 | 撤下作品或金句：删掉 YAML 里的条目和 `Pictures/` 里的图片，合并进 `main` 后自动重新部署 |
| 听说有新的 AI 爬虫时 | 加进 `public/robots.txt` |
| 大约半年一次 | 升级依赖：运行 `npm update`，然后 `npm run build` 和 `npx astro check` 都要通过，再看一眼页面 |
| 有空时 | 看看 [known_issues.md](known_issues.md) 里的问题要不要修 |

### 撤下内容时要注意

从网站上删掉很简单，但**仓库是公开的，Git 历史里还留着旧文件**。如果作者要求彻底删除，需要维护者清理 Git 历史，只删文件是不够的。遇到这种情况，请直接联系维护者。

---

## 最好先问一下维护者再动的地方

- `src/` 下的代码（组件、脚本、数据校验）。只调配色的话，改 `src/styles/global.css` 开头的 `:root` 就行。
- `site.yaml` 里板块的 `id`。
- 许可相关的文件：`LICENSE`、[artwork_license.md](artwork_license.md)。
- 部署配置 `wrangler.jsonc`。
