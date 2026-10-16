'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { SocialLinks } from './socials';
import type { SocialLink } from '@/lib/socials';
export const navigation = [
  ['Strona główna', '/'],
  ['Hiszpański', '/hiszpanski-online/'],
  ['Angielski', '/angielski-online/'],
  ['O nas', '/o-nas/'],
  ['Blog', '/blog/'],
  ['FAQ', '/faq/'],
  ['Kontakt', '/kontakt/'],
] as const;
export default function SiteMenu({ socials }: { socials: SocialLink[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousOverflow = useRef('');
  const [state, setState] = useState<'closed' | 'open' | 'closing'>('closed');
  useEffect(() => {
    const element = dialog.current;
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (element?.open)
        document.body.style.overflow = previousOverflow.current;
    };
  }, []);
  function openMenu() {
    if (!dialog.current || dialog.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    setState('open');
  }
  function closeMenu() {
    if (!dialog.current?.open || state === 'closing') return;
    setState('closing');
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    timer.current = setTimeout(
      () => {
        dialog.current?.close();
        document.body.style.overflow = previousOverflow.current;
        setState('closed');
        trigger.current?.focus({ preventScroll: true });
        timer.current = null;
      },
      reduced ? 0 : 220,
    );
  }
  return (
    <>
      <button
        ref={trigger}
        className="menu-trigger"
        onClick={openMenu}
        aria-expanded={state === 'open'}
        aria-controls="site-menu"
        aria-haspopup="dialog"
      >
        <span>Menu</span>
        <Menu size={25} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        id="site-menu"
        className="nav-overlay"
        data-state={state}
        aria-label="Menu główne"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
      >
        <div className="content-width overlay-inner">
          <div className="overlay-top">
            <Link href="/" onClick={closeMenu} className="overlay-brand">
              Językowa Stacja
              <span>Twoja następna rozmowa zaczyna się tutaj.</span>
            </Link>
            <button
              type="button"
              autoFocus
              onClick={closeMenu}
              className="menu-trigger"
              aria-label="Zamknij menu"
            >
              <span>Zamknij</span>
              <X size={25} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Nawigacja pełnoekranowa" className="overlay-nav">
            {navigation.map(([label, url], index) => (
              <Link
                key={url}
                href={url}
                onClick={closeMenu}
                style={{ '--menu-index': index } as React.CSSProperties}
              >
                <span className="overlay-number">0{index + 1}</span>
                <span>{label}</span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="overlay-bottom">
            <Link className="action" href="/lekcja-probna/" onClick={closeMenu}>
              Umów lekcję próbną
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <SocialLinks links={socials} onNavigate={closeMenu} />
          </div>
        </div>
      </dialog>
    </>
  );
}
