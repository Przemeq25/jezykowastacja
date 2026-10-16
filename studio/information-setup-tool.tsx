import { useState } from 'react';
import { useClient } from 'sanity';
import {
  buildInformationDocuments,
  informationIds,
  missingInformationPages,
} from './information-import';

export function InformationSetupTool() {
  const client = useClient({ apiVersion: '2026-01-01' });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  async function initialize() {
    setBusy(true);
    try {
      const existing = await client.fetch<string[]>(
        '*[_id in $ids]._id',
        {
          ids: [
            ...informationIds,
            ...informationIds.map((id) => `drafts.${id}`),
          ],
        },
        { perspective: 'raw' },
      );
      const missing = missingInformationPages(existing);
      if (!missing.length) {
        setStatus('Dokumenty już istnieją. Zachowano Twoje treści i szkice.');
        return;
      }
      const logo = await client.fetch<string | undefined>(
        '*[_id=="siteSettings"][0].logo.asset._ref',
        {},
        { perspective: 'published' },
      );
      let pdfAssetId: string | undefined;
      if (missing.some((page) => page.attachment)) {
        setStatus('Przesyłam oryginalny PDF regulaminu do Sanity…');
        const siteUrl = (
          process.env.SANITY_STUDIO_SITE_URL ||
          'https://przemeq25.github.io/jezykowastacja'
        ).replace(/\/$/, '');
        const response = await fetch(
          `${siteUrl}/documents/regulamin-kursow-jezykowych.pdf`,
        );
        if (!response.ok)
          throw new Error('Nie udało się pobrać oryginalnego PDF.');
        const bytes = await response.arrayBuffer();
        if (
          bytes.byteLength > 2000000 ||
          new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-'
        )
          throw new Error('Odpowiedź nie jest poprawnym plikiem PDF.');
        const asset = await client.assets.upload(
          'file',
          new Blob([bytes], { type: 'application/pdf' }),
          { filename: 'regulamin-kursow-jezykowych.pdf' },
        );
        pdfAssetId = asset._id;
      }
      const documents = buildInformationDocuments(existing, logo, pdfAssetId);
      let transaction = client.transaction();
      for (const document of documents)
        transaction = transaction.createIfNotExists(document);
      await transaction.commit();
      setStatus(
        `Zapisano ${documents.length} dokumentów. Nowo dodane FAQ i regulamin są opublikowane. Nowa polityka prywatności jest szkicem — uzupełnij i zatwierdź treść przed Publish. Istniejących dokumentów nie nadpisano. Strona odświeży się po buildzie GitHub Pages.`,
      );
    } catch (error) {
      setStatus(
        `Import zatrzymany: ${error instanceof Error ? error.message : 'nieznany błąd'}. Sprawdź, czy zalogowane konto ma prawo zapisu w projekcie.`,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      style={{
        maxWidth: 820,
        margin: '40px auto',
        padding: 28,
        lineHeight: 1.7,
      }}
    >
      <h1>FAQ i dokumenty szkoły</h1>
      <p>
        Dodaje osobne, edytowalne podstrony FAQ, regulaminu i polityki
        prywatności oraz przesyła oryginalny PDF do zasobów Sanity. Nie
        nadpisuje istniejących dokumentów ani szkiców.
      </p>
      <ul>
        <li>
          Regulamin: treść z oryginalnego PDF udostępnionego w ActiveNow, z
          zachowaniem numeracji.
        </li>
        <li>
          FAQ: odpowiedzi opracowane z regulaminu i opisu szkoły na oryginalnej
          stronie.
        </li>
        <li>
          Polityka prywatności: projekt do weryfikacji. Oryginalnej polityki nie
          znaleziono; dokument zostanie zapisany jako szkic, bez automatycznej
          publikacji.
        </li>
      </ul>
      <p>
        W podstronach możesz edytować pytania, rozdziały dokumentów, status
        zatwierdzenia, SEO i podmieniać załącznik PDF. Projekt oznaczony „Do
        weryfikacji” ma noindex i nie trafia do sitemapy.
      </p>
      <button onClick={initialize} disabled={busy}>
        {busy ? 'Przenoszenie…' : 'Przenieś FAQ i dokumenty do Sanity'}
      </button>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
