import { Button } from '@/components/ui';
export default function NotFound() {
  return (
    <div className="content-width py-24">
      <p className="mb-5 text-rust">Przystanek 404</p>
      <h1 className="mb-6 text-4xl">Ta trasa jeszcze nie istnieje.</h1>
      <p className="mb-8 text-muted">
        Wróć na stronę główną i wybierz swój język.
      </p>
      <Button href="/">Wróć na stronę główną</Button>
    </div>
  );
}
