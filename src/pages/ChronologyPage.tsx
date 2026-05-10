import { useMemo } from "react";
import { useSheet } from "../hooks/useSheet";
import { looksCertainDate } from "../lib/text";
import type { ChronologyRow } from "../types";

export default function ChronologyPage() {
  const { rows, loading, error } = useSheet<ChronologyRow>("Chronologie_biographique");

  const [dated, uncertain] = useMemo(() => {
    const certain = rows.filter((row) => looksCertainDate(row.Date_ou_periode));
    const unsure = rows.filter((row) => !looksCertainDate(row.Date_ou_periode));
    return [
      certain.sort((a, b) => Number(a.Ordre || 0) - Number(b.Ordre || 0)),
      unsure.sort((a, b) => Number(a.Ordre || 0) - Number(b.Ordre || 0)),
    ];
  }, [rows]);

  return (
    <section>
      <p className="eyebrow">Repères</p>
      <h1>Chronologie biographique</h1>
      {loading && <p className="status">Chargement de la chronologie…</p>}
      {error && <p className="status error">{error}</p>}
      <div className="timeline">
        {dated.map((row) => (
          <article key={`${row.Ordre}-${row.Evenement}`}>
            <time>{row.Date_ou_periode || "Sans date"}</time>
            <div>
              <h2>{row.Evenement || "Événement non renseigné"}</h2>
              <p>{row.Lieu}</p>
              <small>
                Sources : {row.Source_image || "non renseignées"} · Confiance :{" "}
                {row.Confiance || "non évaluée"}
              </small>
              {row.Commentaire && <p className="note">{row.Commentaire}</p>}
            </div>
          </article>
        ))}
      </div>
      {uncertain.length > 0 && (
        <>
          <h2 className="subheading">Datation incertaine</h2>
          <div className="document-grid">
            {uncertain.map((row) => (
              <article key={`${row.Ordre}-${row.Evenement}`} className="panel">
                <h3>{row.Date_ou_periode || "Date non précisée"}</h3>
                <p>{row.Evenement}</p>
                <small>Sources : {row.Source_image || "non renseignées"}</small>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
