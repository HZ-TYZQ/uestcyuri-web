# 金句显示头像（待实现）

在 `quotes.yaml` 里给金句加一个可选的 `avatar` 字段，署名旁显示小头像，不写就不显示。`Pictures/head/Portrait(古明地道战).jpg` 已经准备好了。

目前金句只支持 `text` 和 `author`；实现时需要同时修改 `src/lib/content.ts` 的校验和 `src/components/Quotes.astro` 的展示。
