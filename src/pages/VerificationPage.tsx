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
          <p className="eyebrow">Contrôle critique</p>
          <h1>Points à vérifier</h1>
        </div>
        <span className="count">{rows.length} point(s)</span>
      </div>
      {loading && <p className="status">Chargement des points à vérifier…</p>}
      {error && <p className="status error">{error}</p>}
      <div className="document-grid">
        {rows.map((row) => (
          <article
            key={row.ID || row.Point_a_verifier}
            className={`panel ${isHighPriority(row.Priorite) ? "low-confidence" : ""}`}
          >
            <div className="card-title-row">
              <h2>{row.Point_a_verifier || "Point non renseigné"}</h2>
              <span className="confidence">{row.Priorite || "priorité non précisée"}</span>
            </div>
            <p>
              <strong>Hypothèses :</strong> {row.Hypotheses || "Non renseignées"}
            </p>
            <p>
              <strong>Méthode :</strong>{" "}
              {row.Methode_de_verification || "Méthode non renseignée"}
            </p>
            <p>
              <strong>Sources :</strong> {row.Sources_images || "Non renseignées"}
            </p>
            <small>Statut : {row.Statut || "non renseigné"}</small>
            {row.Commentaire && <p className="note">{row.Commentaire}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
