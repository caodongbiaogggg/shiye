import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export function readPosts(directory) {
  const slugs = new Set();
  return fs.readdirSync(directory).filter(f => f.endsWith('.md') && !f.startsWith('_')).map(file => {
    const fail = message => { throw new Error(`${file}: ${message}`); };
    const source = fs.readFileSync(path.join(directory, file), 'utf8').replace(/^\uFEFF/, '').replaceAll('\r\n', '\n');
    const match = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
    if (!match) fail('请在文章开头填写 --- 包围的文章信息。');
    let data;
    try { data = parse(match[1]); } catch (error) { fail(`文章信息格式错误：${error.message}`); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) fail('文章信息必须是键值格式。');
    const slug = data.slug ?? file.slice(0, -3);
    if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || ['about', 'content', 'missing'].includes(slug)) fail('文件名或 slug 请使用英文小写、数字、连字符，且不能为 about、content、missing。');
    if (slugs.has(slug)) fail(`文章地址重复：${slug}`);
    slugs.add(slug);
    for (const field of ['title', 'description', 'date', 'category']) if (typeof data[field] !== 'string' || !data[field].trim()) fail(`请填写 ${field}。`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0, 10) !== data.date) fail('date 必须为有效的 YYYY-MM-DD 日期。');
    if (!['学习笔记', '实践记录', '日常随笔'].includes(data.category)) fail('category 必须为学习笔记、实践记录或日常随笔。');
    if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some(t => typeof t !== 'string'))) fail('tags 应为文字数组，例如 [学习方法, 笔记]。');
    for (const field of ['draft', 'sample']) if (data[field] !== undefined && typeof data[field] !== 'boolean') fail(`${field} 请填写 true 或 false。`);
    if (data.minutes !== undefined && (!Number.isInteger(data.minutes) || data.minutes < 1)) fail('minutes 应为正整数。');
    const body = match[2].trim();
    if (!body && !data.draft) fail('正文不能为空。');
    return { slug, title: data.title, date: data.date.replaceAll('-', '.'), category: data.category, description: data.description, tags: data.tags ?? [], minutes: data.minutes ?? Math.max(1, Math.ceil(body.length / 400)), sample: data.sample ?? false, draft: data.draft ?? false, body };
  }).filter(p => !p.draft).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function generatePosts(root = process.cwd()) {
  const posts = readPosts(path.join(root, 'content/posts'));
  const destination = path.join(root, 'app/posts.generated.json');
  const json = JSON.stringify(posts, null, 2) + '\n';
  if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8') !== json) fs.writeFileSync(destination, json);
  return posts;
}
