'use client';
import { useState, type FormEvent } from 'react';
export default function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState('');
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(
      'Dziękujemy! W demo wiadomość nie jest wysyłana. Możesz przetestować formularz bez kontaktowania się z biurem.',
    );
  }
  return (
    <form
      onSubmit={submit}
      className="rounded-[2rem] border border-ink/10 bg-white p-7 md:p-10"
    >
      <h2 className="mb-2 text-2xl">Napisz do biura</h2>
      <p className="mb-7 text-xs text-muted">
        Testowy odbiorca: {email}. Wiadomości nie są wysyłane.
      </p>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold">
          Imię
          <input
            name="name"
            maxLength={100}
            className="field"
            placeholder="Przykładowe imię"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Twój e-mail
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            className="field"
            placeholder="test@example.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Wiadomość
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            className="field resize-y"
            placeholder="Twoja testowa wiadomość…"
          />
        </label>
        <button className="action">Wyślij wiadomość testową ↗</button>
        <p role="status" aria-live="polite" className="text-sm leading-6">
          {status}
        </p>
      </div>
    </form>
  );
}
