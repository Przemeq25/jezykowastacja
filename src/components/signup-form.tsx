'use client';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { basePath } from '@/lib/site';

/** A separate document isolates ActiveNow's global scripts and CSS from React. */
export default function SignupForm({
  kind = 'individual',
}: {
  kind?: 'individual' | 'group';
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);
  const [readyKind, setReadyKind] = useState('');
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== 'stacja:signup-size' ||
        !Number.isFinite(event.data.height)
      )
        return;
      setHeight(Math.max(400, Math.min(12000, event.data.height)));
      setReadyKind(event.data.ready ? kind : '');
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [kind]);
  return (
    <section id="zapisy" className="form-panel signup-panel">
      <p className="eyebrow">Zapisy online · ActiveNow</p>
      <h2>
        {kind === 'group' ? 'Znajdź swoją grupę.' : 'Umów swoje zajęcia.'}
      </h2>
      <p className="form-intro">
        To formularz zapisów Językowej Stacji. Zgłoszenie trafia bezpośrednio do
        szkoły przez ActiveNow.
      </p>
      {readyKind !== kind && <p role="status">Ładowanie formularza zapisów…</p>}
      <iframe
        key={kind}
        ref={frame}
        src={`${basePath}/forms/${kind}.html`}
        title={
          kind === 'group'
            ? 'Zapisy na zajęcia grupowe'
            : 'Zapisy na zajęcia indywidualne i próbne'
        }
        className="signup-frame"
        style={{ height }}
      />
      <p className="form-intro">
        Formularz się nie wyświetla?{' '}
        <a
          href={`${basePath}/forms/${kind}.html`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Otwórz zapisy w osobnej karcie{' '}
          <ExternalLink size={15} className="inline" aria-hidden="true" />
        </a>
      </p>
    </section>
  );
}
