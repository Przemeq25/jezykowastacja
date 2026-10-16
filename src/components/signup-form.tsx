'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { FieldError, useFormValidation } from './form-fields';
export default function SignupForm({
  kind = 'individual',
}: {
  kind?: 'individual' | 'group';
}) {
  const [sent, setSent] = useState(false);
  const courses =
    kind === 'group'
      ? ['Początkujący · wtorek 18:00', 'Konwersacje · czwartek 19:00']
      : ['Lekcja próbna', 'Lekcje indywidualne'];
  const form = useFormValidation({
    name: { label: 'Imię', required: true, max: 100, min: 2 },
    email: { label: 'E-mail', required: true, max: 254, email: true },
    language: {
      label: 'Język',
      required: true,
      max: 30,
      options: ['Hiszpański', 'Angielski'],
    },
    course: {
      label: 'Rodzaj spotkania',
      required: true,
      max: 100,
      options: courses,
    },
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.check(event.currentTarget)) setSent(true);
  }
  return (
    <section id="zapisy" className="form-panel signup-panel">
      <p className="eyebrow">Zapisy · wersja testowa</p>
      <h2>
        {kind === 'group' ? 'Znajdź swoją grupę.' : 'Umów swoje zajęcia.'}
      </h2>
      <p className="form-intro">
        Sprawdź przykładowy proces zapisu. Dane nie są wysyłane ani zapisywane.
        Docelowo w tym miejscu pojawi się formularz szkoły.
      </p>
      {sent ? (
        <div role="status" className="signup-success">
          <CheckCircle2 size={32} aria-hidden="true" />
          <h3>Zgłoszenie testowe gotowe!</h3>
          <p>To demo — zgłoszenie nie trafiło do szkoły.</p>
          <button
            type="button"
            className="action action--secondary"
            onClick={() => setSent(false)}
          >
            Przetestuj ponownie
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={submit}
          onBlur={form.blur}
          onInput={form.input}
          className="form-grid form-grid--two"
        >
          <div className="form-field">
            <label htmlFor={form.props('name').id}>Imię</label>
            <input
              {...form.props('name')}
              name="name"
              required
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
            <label htmlFor={form.props('email').id}>E-mail</label>
            <input
              {...form.props('email')}
              name="email"
              type="email"
              required
              autoComplete="email"
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
            <label htmlFor={form.props('language').id}>Język</label>
            <select
              {...form.props('language')}
              name="language"
              required
              className="field"
              defaultValue=""
            >
              <option value="" disabled>
                Wybierz język
              </option>
              <option>Hiszpański</option>
              <option>Angielski</option>
            </select>
            <FieldError
              id={form.props('language')['aria-describedby']}
              message={form.errors.language}
            />
          </div>
          <div className="form-field">
            <label htmlFor={form.props('course').id}>
              {kind === 'group' ? 'Przykładowa grupa' : 'Rodzaj spotkania'}
            </label>
            <select
              {...form.props('course')}
              name="course"
              required
              className="field"
              defaultValue=""
            >
              <option value="" disabled>
                Wybierz spotkanie
              </option>
              {courses.map((course) => (
                <option key={course}>{course}</option>
              ))}
            </select>
            <FieldError
              id={form.props('course')['aria-describedby']}
              message={form.errors.course}
            />
          </div>
          <button className="action form-wide" type="submit">
            Wyślij zgłoszenie testowe
            <ArrowUpRight size={19} aria-hidden="true" />
          </button>
        </form>
      )}
    </section>
  );
}
