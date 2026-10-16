import Link from 'next/link';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { getSettings } from '@/lib/cms';
import Image from 'next/image';
import { asset } from '@/lib/site';
import { formats, type Section } from '@/lib/content';
export function Photo({
  name,
  alt,
  className = '',
  priority = false,
}: {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={name.startsWith('https://') ? name : asset(name)}
      alt={alt}
      width={800}
      height={1000}
      priority={priority}
      className={`w-full object-cover ${className}`}
    />
  );
}
export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`action ${secondary ? 'action--secondary' : ''}`}
    >
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export async function Formats({ items }: { items?: typeof formats }) {
  const list = items || (await getSettings()).formats;
  return (
    <div className="format-grid">
      {list.map((f, i) => (
        <article key={f.slug} className="format-card">
          <p className="format-number">0{i + 1} / TWÓJ FORMAT</p>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
          <div className="format-bottom">
            <p className="format-price">{f.price}</p>
            <Button href={`/${f.slug}/`} secondary>
              Poznaj zajęcia
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
export function Sections({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-12">
      {sections.map((s, i) => (
        <section data-reveal key={i}>
          <h2 className="mb-5 text-2xl md:text-3xl">{s.title}</h2>
          <p className="whitespace-pre-line leading-8 text-muted">{s.text}</p>
          {s.items && (
            <ul className="mt-6 space-y-3">
              {s.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    size={20}
                    className="shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
export function Faq({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  if (!items.length) return null;
  return (
    <>
      <section data-reveal className="mx-auto max-w-3xl py-20">
        <Eyebrow>Masz pytania?</Eyebrow>
        <h2 className="mb-9 text-3xl md:text-4xl">
          Wszystko zaczyna się od rozmowy.
        </h2>
        {items.map((f) => (
          <details
            key={f.question}
            className="group border-b border-ink/15 py-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {f.question}
              <Plus
                size={22}
                className="shrink-0 transition-transform group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <p className="pt-4 text-muted leading-7">{f.answer}</p>
          </details>
        ))}
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />
    </>
  );
}
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
