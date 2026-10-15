import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getSettings } from '@/lib/cms';
import { absolute, asset } from '@/lib/site';
import { JsonLd } from '@/components/ui';
import './globals.css';
import MotionEnhancer from '@/components/motion-enhancer';
export const metadata: Metadata = {
  metadataBase: new URL(absolute()),
  title: {
    default: 'Językowa Stacja — angielski i hiszpański online',
    template: '%s | Językowa Stacja',
  },
  description:
    'Nauka angielskiego i hiszpańskiego online dla dzieci, młodzieży i dorosłych. Lekcje indywidualne, w parze i grupowe dopasowane do Ciebie.',
  openGraph: {
    locale: 'pl_PL',
    type: 'website',
    siteName: 'Językowa Stacja',
    images: [
      {
        url: asset('hero.webp'),
        width: 800,
        height: 1000,
        alt: 'Językowa Stacja',
      },
    ],
  },
  robots: { index: true, follow: true },
};
const nav = [
  ['Hiszpański', '/hiszpanski-online/'],
  ['Angielski', '/angielski-online/'],
  ['O nas', '/o-nas/'],
  ['Blog', '/blog/'],
  ['Kontakt', '/kontakt/'],
];
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();
  return (
    <html lang="pl">
      <body>
        <a
          href="#main"
          className="fixed -top-20 left-5 z-50 rounded bg-white p-3 focus:top-5"
        >
          Przejdź do treści
        </a>
        <div className="demo-strip">
          Wersja testowa · formularze nie wysyłają zgłoszeń
        </div>
        <header className="site-header">
          <div className="content-width header-inner">
            <Link
              href="/"
              aria-label="Językowa Stacja — strona główna"
              className="wordmark"
            >
              <Image
                src={s.logo || asset('logo.webp')}
                alt="Logo Językowej Stacji"
                width={66}
                height={66}
                priority
              />
              <span>
                Językowa
                <br />
                Stacja
              </span>
            </Link>
            <nav aria-label="Menu główne" className="desktop-nav">
              {nav.map(([label, url]) => (
                <Link key={url} href={url}>
                  {label}
                </Link>
              ))}
              <Link href="/lekcja-probna/" className="action">
                Zapisz się <span aria-hidden="true">↗</span>
              </Link>
            </nav>
            <details className="mobile-nav">
              <summary>Menu +</summary>
              <nav aria-label="Menu mobilne">
                {[...nav, ['Zapisz się', '/lekcja-probna/']].map(
                  ([label, url]) => (
                    <Link key={url} href={url}>
                      {label}
                    </Link>
                  ),
                )}
              </nav>
            </details>
          </div>
        </header>
        <main id="main">{children}</main>
        <MotionEnhancer />
        <footer className="site-footer">
          <div className="content-width footer-inner">
            <div>
              <Image
                src={s.logo || asset('logo.webp')}
                alt="Językowa Stacja"
                width={90}
                height={90}
              />
              <p className="mt-5 max-w-xs text-sm text-muted">
                Angielski i hiszpański online.
                <br />W Twoim tempie. Po Twojemu.
              </p>
            </div>
            <nav aria-label="Menu stopki">
              <h2 className="mb-5 text-lg">Twoja językowa trasa</h2>
              <div className="grid gap-3 text-sm">
                {[
                  ...nav,
                  ['Lekcje indywidualne', '/lekcje-indywidualne/'],
                  ['Zajęcia w parze', '/zajecia-w-parze/'],
                  ['Kursy grupowe', '/kursy-grupowe/'],
                  ['Hiszpański i Mięczaki', '/hiszpanski-mieczaki/'],
                ].map(([label, url]) => (
                  <Link key={url} href={url} className="hover:text-rust">
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
            <div>
              <h2 className="mb-5 text-lg">Porozmawiajmy</h2>
              <a
                className="mb-3 block text-sm underline underline-offset-4"
                href={`mailto:${s.email}`}
              >
                {s.email}
              </a>
              <a
                className="text-sm underline underline-offset-4"
                href={`tel:${s.phone.replace(/\s/g, '')}`}
              >
                {s.phone}
              </a>
            </div>
          </div>
          <div className="content-width footer-bottom">
            © {new Date().getFullYear()} Językowa Stacja
          </div>
        </footer>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            '@id': absolute() + '#organization',
            name: 'Językowa Stacja',
            url: absolute(),
            logo: s.logo || absolute('images/logo.webp'),
            email: s.email,
            telephone: s.phone,
            description:
              'Szkoła angielskiego i hiszpańskiego online dla dzieci, młodzieży i dorosłych.',
          }}
        />
      </body>
    </html>
  );
}
