import Image from 'next/image';
import TestimonialCarousel from './testimonial-carousel';
import { isDemo } from '@/lib/site';
import type { Community } from '@/lib/cms';
import { Eyebrow, JsonLd } from './ui';
import { organizationId } from '@/lib/seo';

export function TeamSection({ content }: { content: Community }) {
  if (!content.teamVisible || !content.team.length) return null;
  return (
    <section
      data-reveal
      id="kadra"
      className="home-section team-section"
      aria-labelledby="team-title"
    >
      <div className="section-heading">
        <div>
          <Eyebrow>{content.teamEyebrow}</Eyebrow>
          <h2 id="team-title">{content.teamTitle}</h2>
        </div>
        <p>{content.teamIntro}</p>
      </div>
      <div className="team-grid">
        {content.team.map((person) => (
          <article key={person._key} className="team-card">
            <div className="team-portrait">
              {person.photoUrl ? (
                <Image
                  src={person.photoUrl}
                  alt={person.photoAlt || person.name}
                  width={700}
                  height={900}
                  sizes="(min-width:1100px) 275px, (min-width:640px) 45vw, 90vw"
                />
              ) : (
                <span className="team-initials" aria-hidden="true">
                  {person.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              )}
            </div>
            <div className="team-copy">
              <p className="team-role">{person.role}</p>
              <h3>{person.name}</h3>
              <p className="team-bio">{person.bio}</p>
            </div>
          </article>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': content.team.map((person) => ({
            '@type': 'Person',
            '@id': organizationId + '-person-' + person._key,
            name: person.name,
            jobTitle: person.role,
            description: person.bio,
            ...(person.photoUrl ? { image: person.photoUrl } : {}),
            worksFor: { '@id': organizationId },
          })),
        }}
      />
    </section>
  );
}

export function TestimonialsSection({ content }: { content: Community }) {
  if (!content.testimonialsVisible || !content.testimonials.length) return null;
  const items = [
    ...content.testimonials,
    ...(isDemo
      ? [
          {
            _key: 'demo-individual',
            author: 'Przykład zajęć 1:1',
            course: 'Zajęcia indywidualne · przykład',
            quote:
              'Najbardziej doceniam czas na spokojną rozmowę i możliwość wracania do trudniejszych tematów we własnym tempie.',
            isDemo: true,
          },
          {
            _key: 'demo-online',
            author: 'Przykład nauki online',
            course: 'Nauka online · przykład',
            quote:
              'Lekcje online łatwo dopasować do planu dnia. Regularne spotkania pomagają mi znaleźć przestrzeń na naukę.',
            isDemo: true,
          },
        ]
      : []),
  ];
  return (
    <section
      data-reveal
      id="opinie"
      className="home-section testimonials-section"
      aria-labelledby="testimonials-title"
    >
      <div className="section-heading">
        <div>
          <Eyebrow>{content.testimonialsEyebrow}</Eyebrow>
          <h2 id="testimonials-title">{content.testimonialsTitle}</h2>
        </div>
        <p>{content.testimonialsIntro}</p>
      </div>
      <TestimonialCarousel items={items} />
    </section>
  );
}
