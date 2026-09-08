import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readPosts } from './posts.mjs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shiye-posts-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return { dir, write: (name, extra = '', date = '2026-09-09') => fs.writeFileSync(path.join(dir, name), `---\ntitle: 测试文章\ndate: "${date}"\ncategory: 学习笔记\ndescription: 测试摘要\n${extra}\n---\n\n## 正文\n\n测试内容。`) };
}
test('sorts posts and excludes drafts and templates from generated content', t => {
  const f = fixture(t);
  f.write('old.md', '', '2026-09-01'); f.write('new.md'); f.write('draft.md', 'draft: true');
  fs.writeFileSync(path.join(f.dir, '_template.md'), 'unfinished template');
  const posts = readPosts(f.dir);
  assert.deepEqual(posts.map(p => p.slug), ['new', 'old']);
  assert.equal(posts[0].sample, false);
  assert.match(posts[0].body, /## 正文/);
});
test('rejects invalid dates, duplicate addresses and reserved routes', t => {
  const f = fixture(t); f.write('bad.md', '', '2026-02-30');
  assert.throws(() => readPosts(f.dir), /bad.md.*date/);
  f.write('bad.md', 'slug: about'); assert.throws(() => readPosts(f.dir), /slug/);
  f.write('bad.md', 'slug: same'); f.write('other.md', 'slug: same');
  assert.throws(() => readPosts(f.dir), /地址重复/);
});
test('renders GFM content while blocking executable HTML and unsafe links', () => {
  const html = renderToStaticMarkup(React.createElement(Markdown, { remarkPlugins: [remarkGfm], skipHtml: true }, '## 标题\n\n- 列表\n\n> 引用\n\n```js\nconst n = 1;\n```\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n![说明](./images/photo.png)\n\n[危险](javascript:alert%281%29)\n\n<script>alert(1)</script>'));
  for (const tag of ['h2', 'ul', 'blockquote', 'pre', 'table', 'img']) assert.ok(html.includes(`<${tag}`), tag);
  assert.ok(html.includes('./images/photo.png'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(!html.includes('<script>'));
});
