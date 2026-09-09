# 拾页 · 学习手记

中文个人学习与博客网站设计初稿。采用 Neobrutalism 风格：粗黑边框、硬阴影、黄紫青配色与手账式页边笔记。包括分类文章列表、文章阅读、关于页面和手机布局。目前保留一篇正式文章，初始示例文章已移除；个人介绍待补充。

## 后续发文章的约定

把本地 `.md` 文件和配图交给助手，说明“发布到拾页”即可。会自动整理文章信息与图片路径、校验构建、推送 GitHub 并检查上线结果，默认保持当前 Neobrutalism 风格。

如需审稿，请说明“先预览”；确认前仅在本地准备，不上传到公开仓库。

- [发布操作流程 PUBLISHING.md](./PUBLISHING.md)：本地文件接收、默认处理、预览、提交、上线验收。
- [写作指南 WRITING.md](./WRITING.md)：Markdown 字段和图片写法。
- [设计基线 DESIGN.md](./DESIGN.md)：当前网站风格和维护规则。
- [AGENTS.md](./AGENTS.md)：后续助手必须遵循的项目约定。

## 本地开发

建议 Node.js 22 LTS。

```sh
npm ci
npm run dev
```

打开终端显示的地址。生产构建：`npm run build`，静态输出在 `dist/client`。

## 修改内容

- `content/posts/*.md`：每篇文章一个 Markdown 文件，按日期从新到旧自动排列。
- 写作流程和字段说明见 [WRITING.md](./WRITING.md)，模板见 [content/posts/_template.md](./content/posts/_template.md)。
- `app/page.tsx`：站名、首页介绍、关于页面。
- `app/globals.css`：配色、字体与响应式布局。
- `app/layout.tsx`：网站标题与描述。

此版文章使用 URL hash（如 `#codex-reconnecting-system-proxy`），便于静态托管和直接分享。不提供后台编辑器；支持 Markdown 写作；独立文章的服务端 SEO 元数据可在后续版本加入。

## 发布到 GitHub Pages

已配置 `.github/workflows/pages.yml`。目标仓库：[caodongbiaogggg/shiye](https://github.com/caodongbiaogggg/shiye)。网站已上线：https://caodongbiaogggg.github.io/shiye/ 。自定义域名以后再配置。

1. 校验文章和图片，构建通过后，将本次修改提交并推送到 `main`。
2. 已启用的 GitHub Actions 自动构建和发布，无需重新创建仓库或配置 Pages。
3. 等待本次提交的发布任务成功，检查线上文章和图片。
4. 此流程根据 Pages 返回的 base_path 适配仓库子目录；不上传 `node_modules`、`dist` 或待审预览目录。

GitHub 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 设计说明

完整设计基线见 [DESIGN.md](./DESIGN.md)，包括设计思路、配色字体、布局尺寸、交互规则、修改入口与已知限制。后续维护从这里开始。

- 配色：亮黄 #FFE34A、紫色 #C4B2FF、青色 #98E4DD、墨黑 #181818，正文保持白底黑字。
- 标题使用粗黑体，正文使用系统无衬线字体；2–3px 边框搭配无模糊硬阴影。
- 页面结构与 Markdown 写作流程保持稳定，详细设计规则见 DESIGN.md。
