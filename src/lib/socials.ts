export type SocialLink = {
  platform: 'instagram' | 'tiktok' | 'facebook';
  label: string;
  url: string;
};
export const defaultSocials: SocialLink[] = [
  {
    platform: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/jezykowa_stacja/',
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@jezykowa_stacja',
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61578993489267',
  },
];
export function validSocials(links: SocialLink[]): SocialLink[] {
  const domains = {
    instagram: ['instagram.com', 'www.instagram.com'],
    tiktok: ['tiktok.com', 'www.tiktok.com'],
    facebook: ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com'],
  };
  return links.filter((link) => {
    try {
      const url = new URL(link.url);
      return (
        url.protocol === 'https:' &&
        domains[link.platform]?.includes(url.hostname)
      );
    } catch {
      return false;
    }
  });
}
