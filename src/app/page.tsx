import type { Metadata } from 'next';
import { ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { SocialSection } from '@/components/socials';
import { pageMetadata, webPageGraph } from '@/lib/seo';
import Link from 'next/link';
import { getSettings, getCommunity } from '@/lib/cms';
import { TeamSection, TestimonialsSection } from '@/components/community';
import { Button, Photo, Eyebrow, Formats, Faq, JsonLd } from '@/components/ui';
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: s.seoTitle,
    description: s.seoDescription,
    image: s.seoImage,
  });
}
export default async function Home() {
  const [s, community] = await Promise.all([getSettings(), getCommunity()]);
  return (
    <>
      <section className="home-hero">
        <div className="content-width hero-grid">
          <div className="hero-copy">
            <Eyebrow>Angielski i hiszpański online</Eyebrow>
            <h1>
              {s.title === 'Język to coś więcej niż słowa.' ? (
                <>
                  Język to coś więcej
                  <br />
                  niż słowa.
                </>
              ) : (
                s.title
              )}
            </h1>
            <p>{s.intro}</p>
            <div className="hero-actions">
              <Button href="/lekcja-probna/">Umów pierwszą lekcję</Button>
              <Button href="#oferta" secondary>
                Poznaj ofertę
              </Button>
            </div>
            <div className="hero-note">
              <span>
                <Check size={15} aria-hidden="true" />
                Bez presji
              </span>
              <span>
                <Check size={15} aria-hidden="true" />W Twoim tempie
              </span>
              <span>
                <Check size={15} aria-hidden="true" />
                Od pierwszej rozmowy
              </span>
            </div>
          </div>
          <div className="hero-photo">
            <Photo
              name={s.heroImage || 'hero.webp'}
              alt="Językowa Stacja — nauka w przyjaznej atmosferze"
              priority
            />
            <div className="photo-note">
              <Check size={20} aria-hidden="true" />
              Po Twojemu. Od początku.
            </div>
          </div>
        </div>
      </section>
      <div className="content-width">
        <div className="route-bar">
          <span>Dla dzieci, młodzieży i dorosłych</span>
          <span>Indywidualnie, w parze lub grupie</span>
          <span>Wszystkie zajęcia online</span>
        </div>
        <section data-reveal id="oferta" className="home-section">
          <div className="section-heading">
            <div>
              <Eyebrow>Wybierz swój kierunek</Eyebrow>
              <h2>
                Dwa języki.
                <br />
                Tyle możliwości.
              </h2>
            </div>
            <p>
              Dla podróży, szkoły, pracy.
              <br />
              Albo po prostu dla siebie.
            </p>
          </div>
          <div className="language-grid">
            {[
              [
                'Hiszpański',
                '¡Hola!',
                'hiszpanski',
                'Rozmawiaj, odkrywaj i poczuj się swobodniej w hiszpańskim.',
              ],
              [
                'Angielski',
                'Hello!',
                'angielski',
                'Zyskaj pewność siebie w codziennych rozmowach.',
              ],
            ].map(([title, greeting, slug, text], i) => (
              <Link
                key={slug}
                href={`/${slug}-online/`}
                className={`language-card ${i ? 'language-card--orange' : ''}`}
              >
                <div className="language-top">
                  <span>JĘZYK ONLINE</span>
                  <ArrowUpRight size={21} aria-hidden="true" />
                </div>
                <span className="greeting">{greeting}</span>
                <h3>{title} online</h3>
                <p>{text}</p>
                <span className="text-link">
                  Poznaj zajęcia <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <section data-reveal className="philosophy-band">
        <div className="content-width philosophy-grid">
          <div className="philosophy-statement">
            <span>JĘZYKOWA STACJA</span>
            <p>
              Twoje cele.
              <br />
              Twoje tempo.
              <br />
              Twój język.
            </p>
            <span>Nauka, która pasuje do Ciebie.</span>
          </div>
          <div className="philosophy-copy">
            <Eyebrow>Nasze podejście</Eyebrow>
            <h2>
              Każdy uczy się inaczej.
              <br />I to jest w porządku.
            </h2>
            <p>{s.philosophy}</p>
            <Button href="/o-nas/" secondary>
              Poznaj nas bliżej
            </Button>
          </div>
        </div>
      </section>
      <div className="content-width">
        <section data-reveal className="home-section">
          <div className="section-heading">
            <div>
              <Eyebrow>Twój rytm. Twoja forma.</Eyebrow>
              <h2>Jak chcesz się uczyć?</h2>
            </div>
            <p>
              Wybierz przestrzeń, w której
              <br />
              najłatwiej Ci próbować.
            </p>
          </div>
          <Formats items={s.formats} />
        </section>
        <section data-reveal className="home-section" style={{ paddingTop: 0 }}>
          <div className="section-heading">
            <div>
              <Eyebrow>Na każdym etapie</Eyebrow>
              <h2>
                Małe i duże
                <br />
                językowe przygody.
              </h2>
            </div>
          </div>
          <div className="audience-grid">
            {s.audiences.map((a) => (
              <article key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </article>
            ))}
          </div>
        </section>
        <TeamSection content={community} />
        <TestimonialsSection content={community} />
        <SocialSection
          links={s.socialLinks}
          title={s.socialTitle}
          intro={s.socialIntro}
        />
        <Faq items={s.homeFaq} />
      </div>
      <JsonLd
        data={webPageGraph(s.seoTitle, s.seoDescription, '', s.seoImage)}
      />
    </>
  );
}
