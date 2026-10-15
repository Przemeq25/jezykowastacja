import type { Metadata } from 'next';
import { TeamSection, TestimonialsSection } from '@/components/community';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPages, getSettings, getPosts, getCommunity } from '@/lib/cms';
import { absolute } from '@/lib/site';
import {
  Button,
  Photo,
  Eyebrow,
  Sections,
  Faq,
  CTA,
  JsonLd,
} from '@/components/ui';
import SignupForm from '@/components/signup-form';
import ContactForm from '@/components/contact-form';
export async function generateStaticParams() {
  return (await getPages()).map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getPages()).find((p) => p.slug === slug);
  return p
    ? {
        title: p.title,
        description: p.description,
        alternates: { canonical: absolute(slug) },
        openGraph: {
          title: p.title,
          description: p.description,
          url: absolute(slug),
        },
      }
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = (await getPages()).find((p) => p.slug === slug);
  if (!page) notFound();
  const s = await getSettings();
  const community = slug === 'o-nas' ? await getCommunity() : null;
  return (
    <>
      <section className="page-hero">
        <div className="content-width">
          <nav aria-label="Ścieżka strony" className="mb-8 text-xs text-muted">
            <Link href="/" className="underline underline-offset-4">
              Strona główna
            </Link>
            <span aria-hidden="true" className="mx-3">
              /
            </span>
            {page.eyebrow}
          </nav>
          <div className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <Eyebrow>{page.eyebrow}</Eyebrow>
              <h1 className="max-w-2xl text-4xl md:text-5xl">{page.title}</h1>
              <p className="mt-6 max-w-xl text-lg text-muted">
                {page.description}
              </p>
              {!['contact', 'blog'].includes(page.kind || '') && (
                <div className="mt-8">
                  <Button href={page.kind ? '#zapisy' : '/lekcja-probna/'}>
                    Umów pierwsze spotkanie
                  </Button>
                </div>
              )}
            </div>
            <Photo
              name={page.image === 'philosophy.webp' ? 'logo.webp' : page.image}
              alt={page.eyebrow}
              priority
              className="aspect-[4/3] rounded-[2rem] object-cover"
            />
          </div>
        </div>
      </section>
      <div className="content-width">
        <div
          className={`py-16 ${page.kind === 'contact' ? 'grid gap-10 md:grid-cols-2' : 'mx-auto max-w-3xl'}`}
        >
          <Sections sections={page.sections} />
          {page.kind === 'contact' && (
            <>
              <div>
                <Eyebrow>Biuro Językowej Stacji</Eyebrow>
                <h2 className="mb-7 text-3xl">
                  Wybierz najwygodniejszą drogę.
                </h2>
                <p className="mb-8 text-muted">
                  Chcesz zapytać o poziom, dostępne terminy lub formę zajęć?
                  Napisz albo zadzwoń. Jeśli masz już wybrany kurs, przejdź do
                  zapisów.
                </p>
                <a
                  className="mb-4 block break-all text-xl font-semibold underline underline-offset-8"
                  href={`mailto:${s.email}`}
                >
                  {s.email}
                </a>
                <a
                  className="mb-9 block text-xl font-semibold underline underline-offset-8"
                  href={`tel:${s.phone.replace(/\s/g, '')}`}
                >
                  {s.phone}
                </a>
                <Button href="/lekcje-indywidualne/" secondary>
                  Przejdź do zapisów
                </Button>
              </div>
              <ContactForm email={s.email} />
            </>
          )}
          {page.kind === 'blog' && (
            <div className="grid gap-8">
              {(await getPosts()).map((post) => (
                <article
                  key={post.slug}
                  className="rounded-[2rem] border border-ink/10 bg-white p-8"
                >
                  <Eyebrow>Poradnik językowy</Eyebrow>
                  <h2 className="mb-5 text-2xl">
                    <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
                  </h2>
                  <p className="mb-6 text-muted">{post.excerpt}</p>
                  <Link
                    className="font-bold underline underline-offset-8"
                    href={`/blog/${post.slug}/`}
                  >
                    Przeczytaj poradnik →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
        {page.kind === 'individual' || page.kind === 'group' ? (
          <SignupForm kind={page.kind} />
        ) : null}
        {community && (
          <>
            <TeamSection content={community} />
            <TestimonialsSection content={community} />
          </>
        )}
        <Faq items={page.faq} />
        {page.kind !== 'contact' && <CTA />}
      </div>
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
              name: page.title,
              item: absolute(slug),
            },
          ],
        }}
      />
    </>
  );
}
