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
    file.includes('/forms/') ||
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
  for (const tag of [
    'property="og:image"',
    'property="og:url"',
    'name="twitter:card"',
    'name="description"',
  ]) {
    if (!html.includes(tag)) errors.push(`${file}: missing SEO tag ${tag}`);
  }
  const structured = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
  if (!structured.length) errors.push(`${file}: missing structured data`);
  for (const [, body] of structured) {
    try {
      JSON.parse(body);
    } catch {
      errors.push(`${file}: invalid JSON-LD`);
    }
  }
  if (/jezykowastacja@gmail\.com|881.?774.?936/.test(html))
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
for (const [kind, id] of [
  ['individual', '181238'],
  ['group', '179720'],
]) {
  const embed = fs.readFileSync(
    path.join(root, 'forms', `${kind}.html`),
    'utf8',
  );
  if (
    !embed.includes(`signup_form_id=${id}`) ||
    !embed.includes('school_id=19620')
  )
    errors.push(`Incorrect ActiveNow integration for ${kind}`);
  if (!embed.includes('noindex') || !embed.includes('brand.css'))
    errors.push(`Embed missing branding or noindex: ${kind}`);
}
const contact = fs.readFileSync(path.join(root, 'kontakt/index.html'), 'utf8');
if (
  !contact.includes(
    'action="https://formsubmit.co/przemyslaw.cichon.1997@gmail.com"',
  ) ||
  !contact.includes('name="_captcha" value="true"')
)
  errors.push('Contact transport or CAPTCHA missing from export');
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log(
  `${files.length} HTML files checked; ${checks} local links valid; SEO tags and JSON-LD valid; intentional ActiveNow and contact form integrations enabled.`,
);
