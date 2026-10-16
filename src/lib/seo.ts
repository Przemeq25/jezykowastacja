import type { Metadata } from 'next';
import { absolute, siteUrl, isDemo } from './site';
import { validSocials } from './socials';
import type { Settings } from './cms';
export const organizationId = absolute() + '#organization';
export function imageUrl(image: string) {
  return image.startsWith('https://')
    ? image
    : `${siteUrl}/images/${image.replace(/^\//, '')}`;
}
export function pageMetadata({
  title,
  description,
  path = '',
  image = 'og-default.png',
  article = false,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  article?: boolean;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title.includes('Językowa Stacja')
    ? title
    : `${title} | Językowa Stacja`;
  const url = absolute(path);
  const images = [
    {
      url: imageUrl(image),
      alt: fullTitle,
      ...(image === 'og-default.png' ? { width: 1200, height: 630 } : {}),
    },
  ];
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    robots: { index: !noIndex, follow: true },
    openGraph: {
      type: article ? 'article' : 'website',
      locale: 'pl_PL',
      siteName: 'Językowa Stacja',
      title: fullTitle,
      description,
      url,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images.map((item) => item.url),
    },
  };
}
export function siteGraph(settings: Settings) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': organizationId,
        name: 'Językowa Stacja',
        url: absolute(),
        logo: settings.logo || imageUrl('logo.webp'),
        description: settings.seoDescription,
        sameAs: validSocials(settings.socialLinks).map((link) => link.url),
        knowsAbout: [
          'Nauka języka angielskiego online',
          'Nauka języka hiszpańskiego online',
        ],
        ...(!isDemo
          ? { email: settings.email, telephone: settings.phone }
          : {}),
      },
      {
        '@type': 'WebSite',
        '@id': absolute() + '#website',
        name: 'Językowa Stacja',
        url: absolute(),
        inLanguage: 'pl-PL',
        publisher: { '@id': organizationId },
      },
    ],
  };
}
export function webPageGraph(
  title: string,
  description: string,
  path = '',
  image = 'og-default.png',
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': absolute(path) + '#webpage',
    url: absolute(path),
    name: title,
    description,
    inLanguage: 'pl-PL',
    isPartOf: { '@id': absolute() + '#website' },
    about: { '@id': organizationId },
    primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl(image) },
  };
}
