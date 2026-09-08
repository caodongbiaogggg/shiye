# 用 Markdown 写文章

每篇文章一个 `.md` 文件，放在 `content/posts`。提交到 GitHub 的 main 分支后会自动发布，等待 Actions 显示绿色完成即可。

## 最简单的方式：直接在 GitHub 写

1. 打开 [文章文件夹](https://github.com/caodongbiaogggg/shiye/tree/main/content/posts)。
2. 查看 `_template.md`，复制其中的内容。
3. 回到文章文件夹，选择 Add file → Create new file，文件名例如 `my-first-note.md`。也可以用 Upload files 上传已写好的文件。
4. 粘贴模板，修改标题、日期、分类、摘要和正文；准备发布时把 `draft: true` 改成 `draft: false`。
5. 点击 Commit changes，提交到 main。到仓库 Actions 等待发布成功。

修改旧文章：打开对应 `.md` 文件，点击铅笔编辑，然后提交。删除文章文件并提交会将它从网站移除。

## 最小文章示例

```md
---
title: "我对学习方法的一点总结"
date: "2026-09-09"
category: "学习笔记"
tags: [学习方法, 复盘]
description: "这篇文章记录了我的三个学习习惯。"
draft: false
---

## 今天学到了什么

在这里写正文，段落之间空一行。

## 我的收获

- 第一个要点
- 第二个要点
```

## 文章信息怎么填

| 字段 | 说明 |
| --- | --- |
| title | 必填，文章标题，建议用英文双引号包围 |
| date | 必填，发布日期，使用 `"YYYY-MM-DD"`；自动按日期倒序排列，不是定时发布功能 |
| category | 必填，学习笔记 / 实践记录 / 日常随笔 三选一 |
| description | 必填，首页显示的摘要 |
| tags | 可选，标签数组，如 `[读书, 复盘]` |
| draft | 可选，true 表示不在网站显示；false 或省略表示发布 |
| slug | 可选，默认取文件名去掉 .md；已发布后尽量不要改动 |
| minutes | 可选，正整数；省略时根据正文长度估算阅读时间 |
| sample | 可选，示例文章才填 true；你自己的文章无需填写 |

文件名使用英文小写、数字和连字符，例如 `reading-notes.md`。不要使用 `about`、`content`、`missing`；不要重复 slug。下划线开头的文件（如 `_template.md`）不会发布，使用模板时记得另存为正常文件名。

草稿仅从网站排除，公开 GitHub 仓库中的草稿文件仍然可以被别人看到。未准备公开的文章先保存在本机、项目文件夹之外。

## 排版与图片

支持标题、加粗、斜体、有序和无序列表、引用、代码块、链接、图片和表格。标题已由网站显示，正文建议从 `##` 二级标题开始。不支持执行 HTML、JavaScript 或 MDX。

图片上传到 `public/images/`，正文使用：

```md
![图片说明](./images/my-photo.png)
```

路径相对网站首页，适配 `/shiye/` 子目录；不要写成 `/images/...`，也不要使用本机磁盘路径。GitHub 的 Markdown 预览可能不显示这种图片路径，以网站实际预览为准。

链接其他文章可写 `[另一篇文章](#reading-notes)`。当前 hash 用作文章地址，暂不支持正文内标题锚点跳转和脚注回跳。

## 本地预览和排错

使用 Node.js 22，首次运行 `npm ci`，然后 `npm run dev`。保存 Markdown 后页面自动更新；新建或删除文章也会更新列表。

`npm run build` 会检查文章信息；缺字段、日期错误、重复地址或错误分类会显示具体文件名，并阻止错误版本发布。修正后重新提交。

不要编辑 `app/posts.generated.json`，它由 Markdown 自动生成，也无需上传它。
