import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('out');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
}
walk(root);
let errors = [];
let checks = 0;
for (const file of files) {
  if (
    file.includes('/studio/') ||
    file.endsWith('/404.html') ||
    file.includes('/_not-found/') ||
    file.includes('/404/')
  )
    continue;
  const html = fs.readFileSync(file, 'utf8');
  if ((html.match(/<h1\b/g) || []).length !== 1)
    errors.push(`${file}: expected one h1`);
  if (!html.includes('rel="canonical"'))
    errors.push(`${file}: missing canonical`);
  if (/activenow\.io|jezykowastacja@gmail\.com|881.?774.?936/.test(html))
    errors.push(`${file}: production integration or contact leaked into demo`);
  for (const [, href] of html.matchAll(/href="([^"#?]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const rel = href.replace(/^\/jezykowastacja\/?/, '').replace(/^\//, '');
    const target = path.join(root, rel);
    if (
      !fs.existsSync(target) &&
      !fs.existsSync(path.join(target, 'index.html'))
    )
      errors.push(`${file}: broken href ${href}`);
    checks++;
  }
}
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log(
  `${files.length} HTML files checked; ${checks} local links valid; demo has no production contact or ActiveNow scripts.`,
);
