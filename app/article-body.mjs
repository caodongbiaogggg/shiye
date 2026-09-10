import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const h = React.createElement;

// Read the Markdown tree so fenced code and formatted headings are handled correctly.
export function collectHeadings(tree, headings) {
  const label = (node) => node.value ?? node.alt ?? (node.children ?? []).map(label).join('');
  const walk = (node) => {
    if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
      const id = `article-section-${headings.length + 1}`;
      node.data = {...node.data, hProperties: {...node.data?.hProperties, id, tabIndex: -1}};
      headings.push({id, depth: node.depth, title: label(node)});
    }
    for (const child of node.children ?? []) walk(child);
  };
  walk(tree);
}

export default function ArticleBody({body}) {
  const headings = [];
  const outline = () => (tree) => collectHeadings(tree, headings);
  const content = Markdown({children: body, remarkPlugins: [remarkGfm, outline], skipHtml: true,
    components: {table: ({children}) => h('div', {className: 'table-scroll'}, h('table', null, children))}});
  const jump = (event) => {
    const id = event.target.closest('[data-article-target]')?.dataset.articleTarget;
    const target = id && document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.focus({preventScroll: true});
    target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
  };
  const groups = [];
  for (const item of headings) {
    const parent = groups[groups.length - 1];
    if (item.depth === 3 && parent?.depth === 2) parent.children.push(item);
    else groups.push({...item, children: []});
  }
  const link = (item) => h('button', {type: 'button', 'data-article-target': item.id}, item.title);
  return h(React.Fragment, null,
    headings.length > 0 && h('details', {className: 'article-toc', open: true},
      h('summary', null, '文章大纲', h('span', null, '箭头折叠 · 标题跳转')),
      h('nav', {'aria-label': '文章大纲', onClick: jump},
        h('ol', null, groups.map(item => h('li', {key: item.id},
          item.children.length ? h('details', {className: 'toc-group', open: true},
            h('summary', {'aria-label': `展开或收起：${item.title}`}, link(item)),
            h('ol', null, item.children.map(child => h('li', {key: child.id, className: 'toc-subsection'}, link(child)))))
          : h('div', {className: 'toc-leaf'}, link(item))))))),
    h('div', {className: 'prose'}, content));
}
