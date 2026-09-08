import fs from 'node:fs';
import path from 'node:path';
const root = 'dist/client';
const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
if (base && !/^\/[a-zA-Z0-9._/-]+$/.test(base)) throw new Error('Invalid BASE_PATH');
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Static index.html is missing');
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(html|js|css|json|rsc)$/.test(file) && base) {
      const text = fs.readFileSync(file, 'utf8');
      fs.writeFileSync(file, text.replaceAll('/_next/', `${base}/_next/`).replaceAll('"/favicon.svg"', `"${base}/favicon.svg"`));
    }
  }
}
walk(root);
fs.writeFileSync(path.join(root, '.nojekyll'), '');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(match => match[1]);
if (!assets.length) throw new Error('No static assets found');
for (const url of assets) {
  if (!url.startsWith(`${base}/`)) throw new Error(`Incorrect asset prefix: ${url}`);
  if (!fs.existsSync(path.join(root, url.slice(base.length + 1)))) throw new Error(`Missing asset: ${url}`);
}
console.log(`Verified ${assets.length} static assets for ${base || '/'}.`);
