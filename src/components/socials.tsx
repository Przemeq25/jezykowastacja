import {
  SiInstagram,
  SiTiktok,
  SiFacebook,
} from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from 'lucide-react';
import { validSocials, type SocialLink } from '@/lib/socials';
const icons = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  facebook: SiFacebook,
};
export function SocialLinks({
  links,
  compact = false,
  onNavigate,
}: {
  links: SocialLink[];
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className={`social-links ${compact ? 'social-links--compact' : ''}`}>
      {validSocials(links).map((link) => {
        const Icon = icons[link.platform];
        return (
          <a
            key={link.platform}
            onClick={onNavigate}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} — nowa karta`}
          >
            <Icon size={19} aria-hidden="true" />
            {!compact && <span>{link.label}</span>}
            {!compact && <ArrowUpRight size={16} aria-hidden="true" />}
          </a>
        );
      })}
    </div>
  );
}
export function SocialSection({
  links,
  title,
  intro,
}: {
  links: SocialLink[];
  title: string;
  intro: string;
}) {
  if (!validSocials(links).length) return null;
  return (
    <section
      className="social-section"
      aria-labelledby="social-title"
      data-reveal
    >
      <div>
        <p className="eyebrow">Między lekcjami</p>
        <h2 id="social-title">{title}</h2>
        <p>{intro}</p>
      </div>
      <SocialLinks links={links} />
    </section>
  );
}
