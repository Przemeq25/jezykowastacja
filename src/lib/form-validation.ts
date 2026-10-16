export type FormErrors = Record<string, string>;
export type FieldRule = {
  label: string;
  required?: boolean;
  min?: number;
  max: number;
  email?: boolean;
  options?: string[];
};
export function validateValue(value: string, rule: FieldRule): string {
  const text = value.trim();
  if (!text)
    return rule.required ? `Uzupełnij pole: ${rule.label.toLowerCase()}.` : '';
  if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
    return 'Wpisz poprawny adres e-mail, np. imie@example.com.';
  if (rule.min && text.length < rule.min)
    return `Wpisz co najmniej ${rule.min} znaków.`;
  if (text.length > rule.max)
    return `Możesz wpisać maksymalnie ${rule.max} znaków.`;
  if (rule.options && !rule.options.includes(text))
    return 'Wybierz jedną z dostępnych opcji.';
  return '';
}
export function validateForm(
  form: HTMLFormElement,
  rules: Record<string, FieldRule>,
): FormErrors {
  const data = new FormData(form);
  return Object.fromEntries(
    Object.entries(rules)
      .map(([name, rule]) => [
        name,
        validateValue(String(data.get(name) || ''), rule),
      ])
      .filter(([, error]) => error),
  );
}
