import { useState } from 'react';
import { useClient } from 'sanity';
import {
  buildSeoPatches,
  type SeoDocument,
  type SeoPatch,
} from '../src/lib/seo-content';

export function SeoSetupTool() {
  const client = useClient({ apiVersion: '2026-01-01' });
  const [patches, setPatches] = useState<SeoPatch[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [previewed, setPreviewed] = useState(false);
  async function preview() {
    setBusy(true);
    setPreviewed(false);
    try {
      const docs = await client.fetch<SeoDocument[]>(
        '*[_type in ["siteSettings","page","post"]]',
        {},
        { perspective: 'raw' },
      );
      const plan = buildSeoPatches(docs);
      setPatches(plan);
      setPreviewed(true);
      setStatus(
        plan.length
          ? `Gotowe do uzupełnienia: ${plan.length} dokumentów.`
          : 'Wszystkie pola SEO są już uzupełnione.',
      );
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : 'Nie udało się odczytać treści.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function apply() {
    setBusy(true);
    try {
      let transaction = client.transaction();
      for (const patch of patches)
        transaction = transaction.patch(patch.id, (p) =>
          p.ifRevisionId(patch.revision).set(patch.set),
        );
      await transaction.commit();
      setPatches([]);
      setPreviewed(false);
      setStatus(
        'SEO zapisane w Sanity. Opublikowane dokumenty zostały uzupełnione; pozostała treść i szkice nie zostały opublikowane. Zmiany będą widoczne na stronie po buildzie GitHub Pages.',
      );
    } catch (e) {
      setStatus(
        `Zapis zatrzymany: ${e instanceof Error ? e.message : 'błąd'}. Ponownie sprawdź pola — dokument mógł zmienić się podczas edycji.`,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: '40px auto',
        padding: 28,
        lineHeight: 1.7,
      }}
    >
      <h1>Uzupełnianie SEO</h1>
      <p>
        Wpisuje brakujące tytuły i opisy przygotowane dla tematu każdej strony.
        Ustawia logo jako obraz SEO. Uzupełnia dane organizacji na podstawie
        oryginalnej witryny i jej linku do profilu Google.
      </p>
      <p>
        Zachowuje istniejące tytuły, opisy i wybór noindex. Szkice otrzymują te
        same uzupełnienia SEO, ale ich pozostała treść nie jest publikowana.
        Zapis jest atomowy i chroniony numerami rewizji.
      </p>
      <button onClick={preview} disabled={busy}>
        Sprawdź brakujące SEO
      </button>
      <p role="status">{status}</p>
      {previewed && patches.length > 0 && (
        <>
          <table
            style={{
              width: '100%',
              textAlign: 'left',
              borderSpacing: '0 16px',
            }}
          >
            <thead>
              <tr>
                <th>Dokument</th>
                <th>Uzupełnienia</th>
              </tr>
            </thead>
            <tbody>
              {patches.map((patch) => (
                <tr key={patch.id}>
                  <td>{patch.id}</td>
                  <td>
                    <pre
                      style={{
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {JSON.stringify(patch.set, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={apply} disabled={busy}>
            Uzupełnij i opublikuj SEO
          </button>
        </>
      )}
    </div>
  );
}
