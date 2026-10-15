export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://przemeq25.github.io/jezykowastacja'
).replace(/\/$/, '');
export const asset = (name: string) => `${basePath}/images/${name}`;
export const absolute = (path = '') =>
  `${siteUrl}${path ? '/' + path.replace(/^\/|\/$/g, '') + '/' : '/'}`;
export const defaultSettings = {
  title: 'Język to coś więcej niż słowa.',
  intro:
    'Pomagamy dzieciom, młodzieży i dorosłym budować pewność siebie w komunikacji po angielsku i hiszpańsku. W spokojnej atmosferze, z pełnym wsparciem i lekcjami dopasowanymi do tego, kim jesteś i czego potrzebujesz.',
  email: 'kontakt@example.com',
  phone: '+48 000 000 000',
  heroImage: '',
  logo: '',
};
export const isDemo = process.env.NEXT_PUBLIC_ENABLE_LIVE_DATA !== 'true';
