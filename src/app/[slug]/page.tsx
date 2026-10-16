import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { pageMetadata, pageGraph } from '@/lib/seo';
import { TeamSection, TestimonialsSection } from '@/components/community';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPages, getSettings, getPosts, getCommunity } from '@/lib/cms';
import { Button, Photo, Eyebrow, Sections, Faq, JsonLd } from '@/components/ui';
import SignupForm from '@/components/signup-form';
import ContactForm from '@/components/contact-form';
import { isIndexablePage } from '@/lib/page-visibility';
import { basePath } from '@/lib/site';
import { contactEmail } from '@/lib/contact';
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
  const settings = await getSettings();
  return p
    ? pageMetadata({
        title: p.seo?.title || p.title,
        description: p.seo?.description || p.description,
        path: slug,
        image: p.seo?.image || settings.seoImage,
        noIndex: !isIndexablePage(p),
      })
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
  const information = page.kind === 'legal' || page.kind === 'faq';
  const attachmentUrl = page.attachment?.url
    ? page.attachment.url.startsWith('https://')
      ? page.attachment.url
      : `${basePath}/${page.attachment.url}`
    : undefined;
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
          <div
            className={
              information
                ? 'max-w-4xl'
                : 'grid items-center gap-10 md:grid-cols-[1.5fr_1fr]'
            }
          >
            <div>
              <Eyebrow>{page.eyebrow}</Eyebrow>
              <h1 className="max-w-2xl text-4xl md:text-5xl">{page.title}</h1>
              <p className="mt-6 max-w-xl text-lg text-muted">
                {page.description}
              </p>
              {!['contact', 'blog', 'faq', 'legal'].includes(
                page.kind || '',
              ) && (
                <div className="mt-8">
                  <Button
                    href={
                      page.kind === 'individual' || page.kind === 'group'
                        ? '#zapisy'
                        : '/lekcja-probna/'
                    }
                  >
                    Umów pierwsze spotkanie
                  </Button>
                </div>
              )}
            </div>
            {!information && (
              <Photo
                name={
                  page.image === 'philosophy.webp' ? 'logo.webp' : page.image
                }
                alt={page.eyebrow}
                priority
                className="aspect-[4/3] rounded-[2rem] object-cover"
              />
            )}
          </div>
        </div>
      </section>
      <div className="content-width">
        <div
          className={`py-16 ${page.kind === 'contact' ? 'grid gap-10 md:grid-cols-2' : 'mx-auto max-w-3xl'}`}
        >
          {(page.sections.length > 0 ||
            page.documentStatus === 'review' ||
            attachmentUrl ||
            page.kind === 'faq') && (
            <div
              className={page.kind === 'legal' ? 'legal-content' : undefined}
            >
              {page.documentStatus === 'review' && (
                <aside
                  className="document-review"
                  aria-label="Status dokumentu"
                >
                  <strong>Projekt do weryfikacji</strong>
                  <p>
                    Dokument wymaga uzupełnienia i zatwierdzenia przez
                    administratora szkoły.
                  </p>
                </aside>
              )}
              {attachmentUrl && (
                <div className="document-file">
                  <a
                    href={attachmentUrl}
                    className="action action--secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {page.slug === 'regulamin'
                      ? 'Otwórz oryginalny regulamin (PDF)'
                      : 'Otwórz dokument (PDF)'}
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                  <details>
                    <summary>Podgląd dokumentu PDF</summary>
                    <object
                      data={attachmentUrl}
                      type="application/pdf"
                      aria-label={`Dokument PDF: ${page.title}`}
                    >
                      <p>
                        Jeśli podgląd nie jest dostępny, otwórz PDF przyciskiem
                        powyżej.
                      </p>
                    </object>
                  </details>
                </div>
              )}
              <Sections sections={page.sections} />
              {page.kind === 'faq' && (
                <Faq
                  items={page.faq}
                  structured={false}
                  compact
                  title="Organizacja, zapisy i nauka"
                />
              )}
            </div>
          )}
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
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
                <a
                  className="mb-9 block text-xl font-semibold underline underline-offset-8"
                  href={`tel:${(s.organization?.telephone || s.phone).replace(/\s/g, '')}`}
                >
                  {s.organization?.telephone || s.phone}
                </a>
                <Button href="/lekcje-indywidualne/" secondary>
                  Przejdź do zapisów
                </Button>
              </div>
              <ContactForm />
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
                    Przeczytaj poradnik{' '}
                    <ArrowRight
                      size={17}
                      className="inline"
                      aria-hidden="true"
                    />
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
        {page.kind !== 'faq' && <Faq items={page.faq} />}
      </div>
      <JsonLd
        data={pageGraph(page, s, page.kind === 'blog' ? await getPosts() : [])}
      />
    </>
  );
}
