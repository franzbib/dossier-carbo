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
      <p className="eyebrow">Repères familiaux</p>
      <h1>Quelques repères chronologiques</h1>
      <p className="page-intro">
        Cette chronologie est construite à partir des documents déjà indexés.
        Certaines dates sont encore incertaines et demandent une relecture des
        images originales.
      </p>
      {loading && <p className="status">La chronologie se charge…</p>}
      {error && <p className="status error">{error}</p>}
      <div className="timeline">
        {dated.map((row) => (
          <article key={`${row.Ordre}-${row.Evenement}`}>
            <time>{row.Date_ou_periode || "Date à préciser"}</time>
            <div>
              <h2>{row.Evenement || "Événement pas encore indiqué"}</h2>
              <p>{row.Lieu}</p>
              <small>
                Sources : {row.Source_image || "pas encore indiquées"} · Lecture :{" "}
                {row.Confiance || "à relire"}
              </small>
              {row.Commentaire && <p className="note">{row.Commentaire}</p>}
            </div>
          </article>
        ))}
      </div>
      {uncertain.length > 0 && (
        <>
          <h2 className="subheading">Dates encore incertaines</h2>
          <div className="document-grid">
            {uncertain.map((row) => (
              <article key={`${row.Ordre}-${row.Evenement}`} className="panel">
                <h3>{row.Date_ou_periode || "Date à préciser"}</h3>
                <p>{row.Evenement}</p>
                <small>Sources : {row.Source_image || "pas encore indiquées"}</small>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
