'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
export type Testimonial = {
  _key: string;
  author: string;
  course: string;
  quote: string;
  sourceUrl?: string;
  isDemo?: boolean;
};
export default function TestimonialCarousel({
  items,
}: {
  items: Testimonial[];
}) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  if (!items.length) return null;
  const current = active % items.length;
  function move(step: number) {
    setActive((value) => (value + step + items.length) % items.length);
  }
  return (
    <div
      className="testimonial-carousel"
      role="region"
      aria-roledescription="karuzela"
      aria-label="Opinie uczniów"
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          move(1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          move(-1);
        }
      }}
      tabIndex={items.length > 1 ? 0 : undefined}
    >
      <div
        className="carousel-window"
        onTouchStart={(event) => {
          startX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (startX.current === null) return;
          const delta = startX.current - event.changedTouches[0].clientX;
          if (Math.abs(delta) > 55) move(delta > 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, index) => (
            <figure
              key={item._key}
              className="testimonial-card carousel-slide"
              role="group"
              aria-roledescription="slajd"
              aria-label={`${index + 1} z ${items.length}`}
              aria-hidden={index !== current}
              inert={index !== current}
            >
              <Quote size={38} strokeWidth={1.5} aria-hidden="true" />
              {item.isDemo && (
                <p className="demo-opinion">Przykładowa opinia · demo</p>
              )}
              <blockquote>
                <p>{item.quote}</p>
              </blockquote>
              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">
                  {item.author[0]}
                </span>
                <span>
                  <strong>{item.author}</strong>
                  <span className="testimonial-course">{item.course}</span>
                </span>
                {item.sourceUrl && /^https:\/\//.test(item.sourceUrl) && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="testimonial-source"
                    aria-label={`Źródło opinii: ${item.author} (nowa karta)`}
                  >
                    Źródło
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      {items.length > 1 && (
        <div className="carousel-controls">
          <div className="carousel-dots" aria-label="Wybierz opinię">
            {items.map((item, index) => (
              <button
                type="button"
                key={item._key}
                aria-label={`Pokaż opinię ${index + 1}`}
                aria-current={current === index ? 'true' : undefined}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Opinia {current + 1} z {items.length}
          </p>
          <div className="carousel-arrows">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Poprzednia opinia"
            >
              <ArrowLeft size={21} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Następna opinia"
            >
              <ArrowRight size={21} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
