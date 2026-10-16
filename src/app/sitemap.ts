import type { MetadataRoute } from 'next';
import { getPages, getPosts } from '@/lib/cms';
import { isIndexablePage } from '@/lib/page-visibility';
import { absolute } from '@/lib/site';
export const dynamic = 'force-static';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: absolute() },
    ...(await getPages()).filter(isIndexablePage).map((p) => ({
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
