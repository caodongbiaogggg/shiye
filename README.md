# 拾页 · 学习手记

中文个人学习与博客网站设计初稿。淡蓝灰背景、墨蓝文字与蓝色强调，页边笔记呼应学习主题。包括分类文章列表、文章阅读、关于页面和手机布局。站名、介绍与四篇文章都是示例内容。

## 本地启动

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

此版文章使用 URL hash（如 `#learning-loop`），便于静态托管和直接分享。不提供后台编辑器；支持 Markdown 写作；独立文章的服务端 SEO 元数据可在后续版本加入。

## 发布到 GitHub Pages

已提供 `.github/workflows/pages.yml`。目标仓库：[caodongbiaogggg/shiye](https://github.com/caodongbiaogggg/shiye)。预期网站地址：https://caodongbiaogggg.github.io/shiye/ 。自定义域名以后再配置。

1. 新建你的 GitHub 仓库，将本项目推送到 `main` 分支，不上传 `node_modules` 或 `dist`。
2. 在仓库 Settings → Pages → Build and deployment 中选择 GitHub Actions。
3. 在 Actions 中手动运行 Publish blog to GitHub Pages，或再次推送代码。
4. 任务成功后从部署结果打开网站。此流程根据 Pages 返回的 base_path 适配仓库子目录和用户根站点。

GitHub 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 设计说明

完整设计基线见 [DESIGN.md](./DESIGN.md)，包括设计思路、配色字体、布局尺寸、交互规则、修改入口与已知限制。后续维护从这里开始。

- 配色：纸面 #F5F7FA、墨蓝 #233B57、强调蓝 #345CE5、辅助文字 #647386、分隔线 #DCE3EC。
- 标题使用系统宋体，正文使用微软雅黑 / Segoe UI，页边手记使用楷体，日期使用 Consolas，无需下载外部字体。
- 首屏呈现网站主题与文章入口；分类切换和文章阅读保持轻量。
- 当前使用生成项目的 React / Vinext 结构，以静态导出面向 GitHub Pages。
