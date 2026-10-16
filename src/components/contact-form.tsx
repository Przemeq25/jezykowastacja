'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactEndpoint } from '@/lib/contact';
import { FieldError, useFormValidation } from './form-fields';
const rules = {
  name: { label: 'Imię', max: 100 },
  email: { label: 'E-mail', required: true, max: 254, email: true },
  message: { label: 'Wiadomość', required: true, min: 10, max: 5000 },
};
export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const form = useFormValidation(rules);
  useEffect(() => {
    const restore = () => setSending(false);
    window.addEventListener('pageshow', restore);
    return () => window.removeEventListener('pageshow', restore);
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    setStatus('');
    if (sending || !form.check(event.currentTarget)) {
      event.preventDefault();
      return;
    }
    // Secondary UX protection. The provider verifies CAPTCHA server-side;
    // browser storage alone is not a security boundary.
    try {
      const last = Number(
        sessionStorage.getItem('stacja:contact:last-submit') || 0,
      );
      const seconds = Math.ceil((last + 60000 - Date.now()) / 1000);
      if (seconds > 0) {
        event.preventDefault();
        setStatus(`Odczekaj ${seconds} s przed kolejną próbą wysłania.`);
        return;
      }
    } catch {
      /* Submission still works when storage is unavailable. */
    }
    const honey = new FormData(event.currentTarget).get('_honey');
    if (honey) {
      event.preventDefault();
      setStatus(
        'Nie udało się wysłać wiadomości. Odśwież stronę i spróbuj ponownie.',
      );
      return;
    }
    // Native POST preserves the provider's server-verified CAPTCHA.
    // Do not display success until the provider has accepted the message.
    try {
      sessionStorage.setItem('stacja:contact:last-submit', String(Date.now()));
    } catch {
      /* CAPTCHA remains active when storage is unavailable. */
    }
    setSending(true);
  }
  return (
    <form
      action={contactEndpoint}
      method="POST"
      noValidate
      onSubmit={submit}
      onBlur={form.blur}
      onInput={form.input}
      className="form-panel"
    >
      <h2>Napisz do biura</h2>
      <p className="form-intro">
        Napisz, czego potrzebujesz. Wysyłkę i weryfikację antyspamową obsługuje
        FormSubmit — po kliknięciu przejdziesz do potwierdzenia CAPTCHA.
      </p>
      <input
        type="hidden"
        name="_subject"
        value="Językowa Stacja — wiadomość z formularza"
      />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="true" />
      <div hidden aria-hidden="true">
        <label htmlFor="contact-website">Zostaw to pole puste</label>
        <input
          id="contact-website"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor={form.props('name').id}>
            Imię <span>(opcjonalnie)</span>
          </label>
          <input
            {...form.props('name')}
            name="name"
            autoComplete="given-name"
            maxLength={100}
            className="field"
            placeholder="Twoje imię"
          />
          <FieldError
            id={form.props('name')['aria-describedby']}
            message={form.errors.name}
          />
        </div>
        <div className="form-field">
          <label htmlFor={form.props('email').id}>Twój e-mail</label>
          <input
            {...form.props('email')}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="field"
            placeholder="imie@example.com"
          />
          <FieldError
            id={form.props('email')['aria-describedby']}
            message={form.errors.email}
          />
        </div>
        <div className="form-field">
          <label htmlFor={form.props('message').id}>Wiadomość</label>
          <textarea
            {...form.props('message')}
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            className="field resize-y"
            placeholder="W czym możemy Ci pomóc?"
          />
          <FieldError
            id={form.props('message')['aria-describedby']}
            message={form.errors.message}
          />
        </div>
        <button className="action" type="submit" disabled={sending}>
          {sending ? 'Przechodzę do weryfikacji…' : 'Wyślij wiadomość'}
          <ArrowUpRight size={19} aria-hidden="true" />
        </button>
        {status && (
          <p role="alert" className="field-error">
            {status}
          </p>
        )}
      </div>
    </form>
  );
}
