import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/cms';
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
  return p
    ? {
        title: p.title,
        description: p.excerpt,
        alternates: { canonical: absolute('blog/' + slug) },
        openGraph: { type: 'article', title: p.title, description: p.excerpt },
      }
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
          ← Wróć do poradników
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
          '@type': 'Article',
          headline: p.title,
          description: p.excerpt,
          url: absolute('blog/' + slug),
          author: { '@type': 'Organization', name: 'Językowa Stacja' },
          publisher: { '@id': absolute() + '#organization' },
          inLanguage: 'pl-PL',
        }}
      />
    </div>
  );
}
