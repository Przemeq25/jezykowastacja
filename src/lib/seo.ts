import type { Metadata } from 'next';
import { absolute, siteUrl } from './site';
import { validSocials } from './socials';
import type { Settings } from './cms';
import type { Page, Post } from './content';
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
  image = 'logo.webp',
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
  const organization = settings.organization;
  const googleUrl = organization?.googleProfileUrl;
  const googleProfile =
    googleUrl &&
    /^https:\/\/(share\.google|(?:www\.)?google\.com|maps\.app\.goo\.gl)\//.test(
      googleUrl,
    )
      ? googleUrl
      : undefined;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': organizationId,
        name: organization?.name || 'Językowa Stacja',
        url: organization?.url || absolute(),
        logo: {
          '@type': 'ImageObject',
          '@id': absolute() + '#logo',
          url: settings.logo || imageUrl('logo.webp'),
        },
        description: organization?.description || settings.seoDescription,
        sameAs: [
          ...new Set([
            ...validSocials(settings.socialLinks).map((link) => link.url),
            ...(googleProfile ? [googleProfile] : []),
          ]),
        ],
        knowsAbout: [
          'Nauka języka angielskiego online',
          'Nauka języka hiszpańskiego online',
        ],
        ...(organization?.email && !organization.email.endsWith('@example.com')
          ? { email: organization.email }
          : {}),
        ...(organization?.telephone &&
        !/^\+48\s?0+/.test(organization.telephone.replace(/\s/g, ''))
          ? { telephone: organization.telephone }
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
  image = 'logo.webp',
  type: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' = 'WebPage',
) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
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

export function pageGraph(page: Page, settings: Settings, posts: Post[] = []) {
  const slug = page.slug;
  const type =
    slug === 'o-nas'
      ? 'AboutPage'
      : page.kind === 'contact'
        ? 'ContactPage'
        : page.kind === 'blog'
          ? 'CollectionPage'
          : 'WebPage';
  const webpage = webPageGraph(
    page.seo?.title || page.title,
    page.seo?.description || page.description,
    slug,
    page.seo?.image || settings.seoImage,
    type,
  );
  const graph: Record<string, unknown>[] = [
    webpage,
    {
      '@type': 'BreadcrumbList',
      '@id': absolute(slug) + '#breadcrumb',
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
    },
  ];
  Object.assign(webpage, {
    breadcrumb: { '@id': absolute(slug) + '#breadcrumb' },
  });
  if (
    [
      'hiszpanski-online',
      'angielski-online',
      'lekcje-indywidualne',
      'zajecia-w-parze',
      'kursy-grupowe',
      'lekcja-probna',
    ].includes(slug)
  ) {
    const serviceId = absolute(slug) + '#service';
    Object.assign(webpage, { mainEntity: { '@id': serviceId } });
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: page.title,
      description: page.description,
      url: absolute(slug),
      provider: { '@id': organizationId },
      serviceType:
        slug === 'hiszpanski-online'
          ? 'Nauka języka hiszpańskiego online'
          : slug === 'angielski-online'
            ? 'Nauka języka angielskiego online'
            : 'Nauka angielskiego i hiszpańskiego online',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: absolute(slug),
      },
      mainEntityOfPage: { '@id': webpage['@id'] },
    });
  } else if (type === 'AboutPage' || type === 'ContactPage') {
    Object.assign(webpage, { mainEntity: { '@id': organizationId } });
  } else if (type === 'CollectionPage') {
    const listId = absolute(slug) + '#articles';
    Object.assign(webpage, { mainEntity: { '@id': listId } });
    graph.push({
      '@type': 'ItemList',
      '@id': listId,
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          '@id': absolute('blog/' + post.slug) + '#article',
          url: absolute('blog/' + post.slug),
          headline: post.title,
        },
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
