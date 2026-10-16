import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JsonLd } from '@/components/ui';
import { pageMetadata, siteGraph } from '@/lib/seo';
import { defaultSettings } from '@/lib/site';
import { formats, audiences, philosophy, homeFaq } from '@/lib/content';
import { validSocials } from '@/lib/socials';
describe('SEO z treści CMS', () => {
  it('generuje zgodne canonical, Open Graph i Twitter z indywidualnym obrazem', () => {
    const meta = pageMetadata({
      title: 'Nowy poradnik',
      description: 'Opis z CMS',
      path: 'blog/nowy-poradnik',
      image: 'https://cdn.sanity.io/example.png',
      article: true,
    });
    expect(meta.alternates?.canonical).toMatch(/\/blog\/nowy-poradnik\/$/);
    expect(meta.openGraph).toMatchObject({
      type: 'article',
      description: 'Opis z CMS',
      images: [{ url: 'https://cdn.sanity.io/example.png' }],
    });
    expect(meta.twitter).toMatchObject({
      card: 'summary_large_image',
      description: 'Opis z CMS',
    });
  });
  it('serializuje JSON-LD bez możliwości zakończenia znacznika script i bez zmiany tekstu', () => {
    const data = { name: 'Lekcja </script><script>alert(1)</script>' };
    const html = renderToStaticMarkup(<JsonLd data={data} />);
    const body = html.slice(
      html.indexOf('>') + 1,
      html.lastIndexOf('</script>'),
    );
    expect(body).not.toContain('</script>');
    expect(JSON.parse(body)).toEqual(data);
  });
  it('pomija testowe kontakty i nie tworzy sztucznych ocen w danych organizacji', () => {
    const graph = siteGraph({
      ...defaultSettings,
      formats,
      audiences,
      philosophy,
      homeFaq,
    });
    expect(JSON.stringify(graph)).not.toContain('kontakt@example.com');
    expect(JSON.stringify(graph)).not.toContain('AggregateRating');
    expect(graph['@graph'][0]).toHaveProperty('sameAs', [
      ...defaultSettings.socialLinks.map((link) => link.url),
      defaultSettings.organization.googleProfileUrl,
    ]);
  });
  it('odrzuca obce domeny i niebezpieczne protokoły dla profili społecznościowych', () => {
    expect(
      validSocials([
        {
          platform: 'instagram',
          label: 'Instagram',
          url: 'https://example.com/',
        },
        { platform: 'tiktok', label: 'TikTok', url: 'javascript:alert(1)' },
      ]),
    ).toEqual([]);
  });
});
