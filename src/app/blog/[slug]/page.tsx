import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { pageMetadata, imageUrl, organizationId } from '@/lib/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getSettings } from '@/lib/cms';
import { absolute } from '@/lib/site';
import { Eyebrow, Sections, CTA, JsonLd } from '@/components/ui';
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getPosts()).find((p) => p.slug === slug);
  const settings = await getSettings();
  return p
    ? pageMetadata({
        title: p.seo?.title || p.title,
        description: p.seo?.description || p.excerpt,
        path: 'blog/' + slug,
        image: p.seo?.image || settings.seoImage,
        article: true,
        noIndex: p.seo?.noIndex,
      })
    : {};
}
export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await getPosts()).find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <div className="content-width">
      <article className="mx-auto max-w-3xl py-14 md:py-20">
        <Link
          className="mb-10 inline-block text-sm underline underline-offset-4"
          href="/blog/"
        >
          <ArrowLeft size={17} className="inline mr-2" aria-hidden="true" />
          Wróć do poradników
        </Link>
        <Eyebrow>Poradnik Językowej Stacji</Eyebrow>
        <h1 className="mb-7 text-4xl md:text-5xl">{p.title}</h1>
        <p className="mb-14 text-xl text-muted">{p.excerpt}</p>
        <Sections sections={p.sections} />
      </article>
      <CTA />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Strona główna',
              item: absolute(),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: absolute('blog'),
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: p.title,
              item: absolute('blog/' + slug),
            },
          ],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: p.title,
          image: imageUrl(p.seo?.image || p.image),
          ...(p.publishedAt ? { datePublished: p.publishedAt } : {}),
          ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
          mainEntityOfPage: absolute('blog/' + slug),
          description: p.excerpt,
          url: absolute('blog/' + slug),
          author: {
            '@type': 'Organization',
            '@id': organizationId,
            name: 'Językowa Stacja',
            url: absolute(),
          },
          publisher: { '@id': absolute() + '#organization' },
          inLanguage: 'pl-PL',
        }}
      />
    </div>
  );
}
