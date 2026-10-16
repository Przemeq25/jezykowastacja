'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { FieldError, useFormValidation } from './form-fields';
const rules = {
  name: { label: 'Imię', max: 100 },
  email: { label: 'E-mail', required: true, max: 254, email: true },
  message: { label: 'Wiadomość', required: true, min: 10, max: 5000 },
};
export default function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState('');
  const form = useFormValidation(rules);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    if (!form.check(event.currentTarget)) return;
    setStatus(
      'Dziękujemy! Formularz został poprawnie wypełniony. W wersji testowej wiadomość nie jest wysyłana.',
    );
  }
  return (
    <form
      noValidate
      onSubmit={submit}
      onBlur={form.blur}
      onInput={form.input}
      className="form-panel"
    >
      <h2>Napisz do biura</h2>
      <p className="form-intro">
        Testowy odbiorca: {email}. Wiadomości nie są wysyłane.
      </p>
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
        <button className="action" type="submit">
          Wyślij wiadomość testową
          <ArrowUpRight size={19} aria-hidden="true" />
        </button>
        {status && (
          <p role="status" className="form-success">
            <CheckCircle2 size={22} aria-hidden="true" />
            {status}
          </p>
        )}
      </div>
    </form>
  );
}
