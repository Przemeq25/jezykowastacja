import type { MetadataRoute } from 'next';
import { getPages, getPosts } from '@/lib/cms';
import { absolute } from '@/lib/site';
export const dynamic = 'force-static';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: absolute() },
    ...(await getPages())
      .filter((p) => !p.seo?.noIndex)
      .map((p) => ({
        url: absolute(p.slug),
        ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
      })),
    ...(await getPosts())
      .filter((p) => !p.seo?.noIndex)
      .map((p) => ({
        url: absolute('blog/' + p.slug),
        ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
      })),
  ];
}
