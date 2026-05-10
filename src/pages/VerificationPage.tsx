import { useSheet } from "../hooks/useSheet";
import type { VerificationRow } from "../types";

function isHighPriority(value?: string): boolean {
  return (value || "").toLowerCase().includes("haute");
}

export default function VerificationPage() {
  const { rows, loading, error } = useSheet<VerificationRow>("Points_a_verifier");

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Relectures utiles</p>
          <h1>Ce qu’il faut encore éclaircir</h1>
          <p className="page-intro">
            Cette page rassemble les lectures incertaines, les dates douteuses ou
            les passages qui méritent une relecture attentive.
          </p>
        </div>
        <span className="count">{rows.length} point(s)</span>
      </div>
      {loading && <p className="status">Les points à relire se chargent…</p>}
      {error && <p className="status error">{error}</p>}
      <div className="document-grid">
        {rows.map((row) => (
          <article
            key={row.ID || row.Point_a_verifier}
            className={`panel ${isHighPriority(row.Priorite) ? "low-confidence" : ""}`}
          >
            <div className="card-title-row">
              <h2>{row.Point_a_verifier || "Point à préciser"}</h2>
              <span className="confidence">{row.Priorite || "priorité à préciser"}</span>
            </div>
            <p>
              <strong>Pistes possibles :</strong> {row.Hypotheses || "Pas encore indiquées"}
            </p>
            <p>
              <strong>Comment vérifier :</strong>{" "}
              {row.Methode_de_verification || "Méthode pas encore indiquée"}
            </p>
            <p>
              <strong>Documents à relire :</strong> {row.Sources_images || "Pas encore indiqués"}
            </p>
            <small>Avancement : {row.Statut || "pas encore indiqué"}</small>
            {row.Commentaire && <p className="note">{row.Commentaire}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
