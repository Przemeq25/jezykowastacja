'use client';
import { useId, useState, type FormEvent, type FocusEvent } from 'react';
import { CircleAlert } from 'lucide-react';
import {
  validateForm,
  validateValue,
  type FieldRule,
  type FormErrors,
} from '@/lib/form-validation';
export function useFormValidation(rules: Record<string, FieldRule>) {
  const id = useId();
  const [errors, setErrors] = useState<FormErrors>({});
  function check(form: HTMLFormElement) {
    const next = validateForm(form, rules);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      const field = form.elements.namedItem(first);
      if (field instanceof HTMLElement) field.focus();
      return false;
    }
    return true;
  }
  function blur(event: FocusEvent<HTMLFormElement>) {
    const field = event.target;
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) ||
      !rules[field.name]
    )
      return;
    setErrors((previous) => ({
      ...previous,
      [field.name]: validateValue(field.value, rules[field.name]),
    }));
  }
  function input(event: FormEvent<HTMLFormElement>) {
    const field = event.target;
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) ||
      !errors[field.name]
    )
      return;
    setErrors((previous) => ({
      ...previous,
      [field.name]: validateValue(field.value, rules[field.name]),
    }));
  }
  function props(name: string) {
    return {
      id: `${id}-${name}`,
      'aria-invalid': !!errors[name],
      'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
    };
  }
  return { errors, check, blur, input, props };
}
export function FieldError({ id, message }: { id?: string; message?: string }) {
  return message ? (
    <span id={id} className="field-error" role="status">
      <CircleAlert size={16} aria-hidden="true" />
      {message}
    </span>
  ) : null;
}
