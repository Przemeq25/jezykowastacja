import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, ArrowUpRight, Heart } from 'lucide-react';
import { getSettings } from '@/lib/cms';
import { absolute, asset } from '@/lib/site';
import { pageMetadata, siteGraph, imageUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui';
import SiteMenu from '@/components/site-menu';
import { SocialLinks } from '@/components/socials';
import MotionEnhancer from '@/components/motion-enhancer';
import './globals.css';
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(absolute()),
    icons: { icon: settings.logo || imageUrl('logo.webp') },
    ...pageMetadata({
      title: settings.seoTitle,
      description: settings.seoDescription,
      image: settings.seoImage,
    }),
  };
}
const footerCourses = [
  ['Hiszpański online', '/hiszpanski-online/'],
  ['Angielski online', '/angielski-online/'],
  ['Lekcje indywidualne', '/lekcje-indywidualne/'],
  ['Zajęcia w parze', '/zajecia-w-parze/'],
  ['Kursy grupowe', '/kursy-grupowe/'],
];
const footerSchool = [
  ['O nas i kadrze', '/o-nas/'],
  ['Opinie uczniów', '/#opinie'],
  ['Poradniki językowe', '/blog/'],
  ['Hiszpański i Mięczaki', '/hiszpanski-mieczaki/'],
  ['Kontakt', '/kontakt/'],
];
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html lang="pl">
      <body>
        <a href="#main" className="skip-link">
          Przejdź do treści
        </a>
        <div className="demo-strip">
          Wersja testowa strony · zapisy ActiveNow są aktywne
        </div>
        <header className="site-header">
          <div className="content-width header-inner">
            <Link
              href="/"
              aria-label="Językowa Stacja — strona główna"
              className="wordmark"
            >
              <Image
                src={settings.logo || asset('logo.webp')}
                alt="Logo Językowej Stacji"
                width={60}
                height={60}
                priority
              />
              <span>
                Językowa
                <br />
                Stacja
              </span>
            </Link>
            <div className="header-actions">
              <div className="header-socials">
                <SocialLinks links={settings.socialLinks} compact />
              </div>
              <SiteMenu socials={settings.socialLinks} />
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
        <MotionEnhancer />
        <footer className="site-footer">
          <div className="content-width">
            <div className="footer-callout">
              <div>
                <p className="eyebrow">Kolejny przystanek? Rozmowa.</p>
                <h2>Znajdź swój językowy rytm.</h2>
              </div>
              <Link href="/lekcja-probna/" className="action">
                Umów pierwszą lekcję
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </div>
            <div className="footer-grid">
              <div className="footer-brand">
                <Link href="/" className="wordmark">
                  <Image
                    src={settings.logo || asset('logo.webp')}
                    alt="Językowa Stacja — strona główna"
                    width={64}
                    height={64}
                  />
                  <span>
                    Językowa
                    <br />
                    Stacja
                  </span>
                </Link>
                <p>
                  Angielski i hiszpański online.
                  <br />W Twoim tempie. Po Twojemu.
                </p>
                <SocialLinks links={settings.socialLinks} compact />
              </div>
              <nav aria-label="Zajęcia — stopka">
                <h3>Wybierz zajęcia</h3>
                {footerCourses.map(([label, url]) => (
                  <Link key={url} href={url}>
                    {label}
                  </Link>
                ))}
              </nav>
              <nav aria-label="Szkoła — stopka">
                <h3>Poznaj stację</h3>
                {footerSchool.map(([label, url]) => (
                  <Link key={url} href={url}>
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="footer-contact">
                <h3>Porozmawiajmy</h3>
                <a
                  href={`mailto:${settings.organization?.email || settings.email}`}
                >
                  <Mail size={18} aria-hidden="true" />
                  <span>{settings.organization?.email || settings.email}</span>
                </a>
                <a
                  href={`tel:${(settings.organization?.telephone || settings.phone).replace(/\s/g, '')}`}
                >
                  <Phone size={18} aria-hidden="true" />
                  <span>
                    {settings.organization?.telephone || settings.phone}
                  </span>
                </a>
                <p>
                  Zajęcia prowadzimy online.
                  <br />
                  Możesz dołączyć z dowolnego miejsca.
                </p>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} Językowa Stacja</span>
              <span>
                Z ciekawością do języków <Heart size={14} aria-hidden="true" />
              </span>
            </div>
          </div>
        </footer>
        <JsonLd data={siteGraph(settings)} />
      </body>
    </html>
  );
}
