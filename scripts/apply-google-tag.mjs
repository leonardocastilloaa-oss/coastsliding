import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const tag = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-29S24YXK2D"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-29S24YXK2D');
</script>`;

const tagPattern = /<!-- Google tag \(gtag\.js\) -->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-29S24YXK2D"><\/script>\s*<script>[\s\S]*?gtag\('config', 'G-29S24YXK2D'\);\s*<\/script>\s*/g;

async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listHtmlFiles(full));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let changed = 0;
const files = await listHtmlFiles(process.cwd());
for (const file of files) {
  const original = await readFile(file, 'utf8');
  let html = original.replace(tagPattern, '');
  if (!/<head(\s[^>]*)?>/i.test(html)) continue;
  html = html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}\n${tag}`);
  if (html !== original) {
    await writeFile(file, html, 'utf8');
    changed++;
  }
}

console.log(`Google tag applied to ${changed} of ${files.length} HTML files.`);
