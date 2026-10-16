import type { ReactNode, MouseEvent } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SiteMenu from '@/components/site-menu';
import ContactForm from '@/components/contact-form';
import SignupForm from '@/components/signup-form';
import TestimonialCarousel from '@/components/testimonial-carousel';
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
    ...rest
  }: {
    href: string;
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  }) => (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

describe('menu pełnoekranowe', () => {
  it('zamyka się także po wybraniu aktualnej strony, przywracascroll i fokus', () => {
    vi.useFakeTimers();
    document.body.style.overflow = 'auto';
    render(<SiteMenu socials={[]} />);
    const trigger = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Menu główne' });
    expect(dialog).toHaveAttribute('open');
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.click(
      within(dialog).getByRole('link', { name: /Strona główna/ }),
    );
    expect(dialog).toHaveAttribute('data-state', 'closing');
    act(() => vi.advanceTimersByTime(240));
    expect(dialog).not.toHaveAttribute('open');
    expect(document.body.style.overflow).toBe('auto');
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    expect(dialog).toHaveAttribute('open');
  });
  it('obsługuje natywne anulowanie dialogu (Escape)', () => {
    vi.useFakeTimers();
    render(<SiteMenu socials={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const dialog = screen.getByRole('dialog');
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }));
    act(() => vi.advanceTimersByTime(240));
    expect(dialog).not.toHaveAttribute('open');
    expect(document.body.style.overflow).toBe('');
  });
  it('odblokowuje stronę po odmontowaniu otwartego menu', () => {
    const view = render(<SiteMenu socials={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(document.body.style.overflow).toBe('hidden');
    view.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('walidacja formularzy', () => {
  it('pokazuje błędy przy polach i ustawia fokus na pierwszym niepoprawnym polu', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /Wyślij wiadomość/ }));
    const email = screen.getByLabelText('Twój e-mail');
    const message = screen.getByLabelText('Wiadomość');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Uzupełnij pole: e-mail.');
    expect(message).toHaveAccessibleDescription('Uzupełnij pole: wiadomość.');
    expect(email).toHaveFocus();
    await user.type(email, 'niepoprawny');
    await user.tab();
    expect(email).toHaveAccessibleDescription(/poprawny adres/);
    await user.clear(email);
    await user.type(email, 'test@example.com');
    expect(email).toHaveAttribute('aria-invalid', 'false');
    await user.type(message, 'krótko');
    await user.tab();
    expect(message).toHaveAccessibleDescription('Wpisz co najmniej 10 znaków.');
  });
  it('wysyła natywnym POST do wskazanego odbiorcy z CAPTCHA i blokuje ponowną próbę', async () => {
    sessionStorage.clear();
    const user = userEvent.setup();
    const view = render(<ContactForm />);
    await user.type(screen.getByLabelText('Twój e-mail'), 'test@example.com');
    await user.type(
      screen.getByLabelText('Wiadomość'),
      'Chcę zapytać o lekcje próbne.',
    );
    const form = view.container.querySelector('form')!;
    expect(form).toHaveAttribute(
      'action',
      'https://formsubmit.co/przemyslaw.cichon.1997@gmail.com',
    );
    expect(form).toHaveAttribute('method', 'POST');
    expect(new FormData(form).get('_captcha')).toBe('true');
    expect(new FormData(form).get('_honey')).toBe('');
    // Dispatch the event directly: verify transport intent without sending mail.
    const submission = new Event('submit', { bubbles: true, cancelable: true });
    act(() => {
      form.dispatchEvent(submission);
    });
    expect(submission.defaultPrevented).toBe(false);
    expect(screen.getByRole('button', { name: /Przechodzę/ })).toBeDisabled();
    fireEvent(window, new Event('pageshow'));
    const repeat = new Event('submit', { bubbles: true, cancelable: true });
    act(() => {
      form.dispatchEvent(repeat);
    });
    expect(repeat.defaultPrevented).toBe(true);
    expect(screen.getByRole('alert')).toHaveTextContent(/Odczekaj/);
    sessionStorage.clear();
  });
  it('blokuje wypełniony honeypot bez pokazywania fałszywego sukcesu', async () => {
    sessionStorage.clear();
    const user = userEvent.setup();
    const view = render(<ContactForm />);
    await user.type(screen.getByLabelText('Twój e-mail'), 'test@example.com');
    await user.type(
      screen.getByLabelText('Wiadomość'),
      'To jest poprawna wiadomość.',
    );
    fireEvent.change(view.container.querySelector('[name="_honey"]')!, {
      target: { value: 'spam' },
    });
    const event = new Event('submit', { bubbles: true, cancelable: true });
    act(() => {
      view.container.querySelector('form')!.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole('alert')).toHaveTextContent(/Nie udało się/);
  });
  it('wybiera właściwy formularz i odrzuca komunikaty spoza ramki', () => {
    const view = render(<SignupForm kind="group" />);
    const frame = screen.getByTitle(
      'Zapisy na zajęcia grupowe',
    ) as HTMLIFrameElement;
    expect(frame.src).toContain('/forms/group.html');
    fireEvent(
      window,
      new MessageEvent('message', {
        origin: 'https://evil.example',
        source: frame.contentWindow,
        data: { type: 'stacja:signup-size', height: 1200, ready: true },
      }),
    );
    expect(frame.style.height).toBe('900px');
    fireEvent(
      window,
      new MessageEvent('message', {
        origin: window.location.origin,
        source: frame.contentWindow,
        data: { type: 'stacja:signup-size', height: 1200, ready: true },
      }),
    );
    expect(frame.style.height).toBe('1200px');
    expect(screen.queryByText('Ładowanie formularza zapisów…')).toBeNull();
    view.rerender(<SignupForm kind="individual" />);
    expect(
      screen.getByTitle('Zapisy na zajęcia indywidualne i próbne'),
    ).toHaveAttribute('src', '/forms/individual.html');
  });
});

const opinions = [
  { _key: 'a', author: 'Anna', course: '1:1', quote: 'Pierwsza opinia' },
  { _key: 'b', author: 'Jan', course: 'Grupa', quote: 'Druga opinia' },
];
describe('karuzela opinii', () => {
  it('przełącza slajdy przyciskami i klawiaturą, nie udostępnia ukrytych linków', async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel items={opinions} />);
    expect(screen.getByRole('group', { name: '1 z 2' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Następna opinia' }));
    expect(screen.getByRole('group', { name: '2 z 2' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Pokaż opinię 2' }),
    ).toHaveAttribute('aria-current', 'true');
    const region = screen.getByRole('region', { name: 'Opinie uczniów' });
    region.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('group', { name: '1 z 2' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Poprzednia opinia' }));
    expect(screen.getByRole('group', { name: '2 z 2' })).toBeVisible();
  });
  it('obsługuje gest przesunięcia i pojedynczą opinię bez zbędnych kontrolek', () => {
    const view = render(<TestimonialCarousel items={opinions} />);
    const window = view.container.querySelector('.carousel-window')!;
    fireEvent.touchStart(window, { touches: [{ clientX: 220 }] });
    fireEvent.touchEnd(window, { changedTouches: [{ clientX: 80 }] });
    expect(screen.getByRole('group', { name: '2 z 2' })).toBeVisible();
    view.rerender(<TestimonialCarousel items={[opinions[0]]} />);
    expect(screen.getByRole('group', { name: '1 z 1' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Następna opinia' }),
    ).toBeNull();
  });
});
