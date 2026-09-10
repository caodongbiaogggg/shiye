import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ArticleBody from '../app/article-body.mjs';

test('outline matches formatted and repeated headings, excluding code blocks', () => {
  const body = '## **安装**\n\n### 登录\n\n```md\n## 不是章节\n```\n\n## **安装**';
  const html = renderToStaticMarkup(React.createElement(ArticleBody, {body}));
  assert.equal((html.match(/data-article-target=/g) ?? []).length, 3);
  for (let index = 1; index <= 3; index++) {
    assert.ok(html.includes(`data-article-target="article-section-${index}"`));
    assert.ok(html.includes(`id="article-section-${index}"`));
  }
  assert.ok(!html.includes('href="#article-section-'));
  assert.ok(html.includes('>安装</button>'));
});

test('articles without sections have no empty outline', () => {
  const html = renderToStaticMarkup(React.createElement(ArticleBody, {body: '一段正文'}));
  assert.ok(!html.includes('article-toc'));
  assert.ok(html.includes('一段正文'));
});

test('only chapters with children get independent disclosure groups', () => {
  const html = renderToStaticMarkup(React.createElement(ArticleBody, {body: '## 安装\n### Windows\n### macOS\n## 开始使用'}));
  assert.equal((html.match(/class="toc-group"/g) ?? []).length, 1);
  assert.match(html, /展开或收起：安装/);
  assert.match(html, /Windows<\/button>[\s\S]*macOS<\/button>[\s\S]*<\/details>[\s\S]*开始使用<\/button>/);
});
