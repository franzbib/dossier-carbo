import { useMemo, useState } from "react";
import { useSheet } from "../hooks/useSheet";
import { isLowConfidence, isYes, normalizeText, splitList } from "../lib/text";
import type { ArchiveRow } from "../types";

const SEARCH_FIELDS: Array<keyof ArchiveRow> = [
  "Nom_fichier",
  "Transcription_brute",
  "Transcription_corrigee",
  "Resume",
  "Personnes",
  "Lieux",
  "Organisations",
  "Themes_mots_cles",
  "Evenement",
];

function uniqueValues(rows: ArchiveRow[], field: keyof ArchiveRow): string[] {
  return Array.from(new Set(rows.map((row) => row[field]).filter(Boolean))).sort();
}

function Tags({ value }: { value?: string }) {
  const items = splitList(value);
  if (items.length === 0) return <span className="muted">Pas encore indiqué</span>;
  return (
    <div className="tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export default function ArchivesPage() {
  const { rows, loading, error } = useSheet<ArchiveRow>("Archives");
  const [query, setQuery] = useState("");
  const [confidence, setConfidence] = useState("");
  const [type, setType] = useState("");
  const [verify, setVerify] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confidenceOptions = useMemo(
    () => uniqueValues(rows, "Niveau_confiance"),
    [rows],
  );
  const typeOptions = useMemo(() => uniqueValues(rows, "Type_document"), [rows]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return rows.filter((row) => {
      const searchable = SEARCH_FIELDS.map((field) => row[field]).join(" ");
      const matchesQuery =
        !normalizedQuery || normalizeText(searchable).includes(normalizedQuery);
      const matchesConfidence =
        !confidence || row.Niveau_confiance === confidence;
      const matchesType = !type || row.Type_document === type;
      const matchesVerify =
        !verify ||
        (verify === "oui" && isYes(row.A_verifier)) ||
        (verify === "non" && !isYes(row.A_verifier));

      return matchesQuery && matchesConfidence && matchesType && matchesVerify;
    });
  }, [rows, query, confidence, type, verify]);

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Parcourir les documents</p>
          <h1>Les documents</h1>
          <p className="page-intro">
            Chaque fiche aide à se repérer dans le dossier. Les résumés et les
            transcriptions restent des aides de lecture : l’image originale doit
            être relue pour toute conclusion importante.
          </p>
        </div>
        <span className="count">{filtered.length} document(s)</span>
      </div>

      <div className="filters">
        <label>
          Rechercher dans les transcriptions
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, lieu, thème, passage du texte…"
          />
        </label>
        <label>
          Niveau de confiance
          <select value={confidence} onChange={(event) => setConfidence(event.target.value)}>
            <option value="">Tous</option>
            {confidenceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type de document
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">Tous</option>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          À relire avec attention
          <select value={verify} onChange={(event) => setVerify(event.target.value)}>
            <option value="">Tous</option>
            <option value="oui">Oui</option>
            <option value="non">Non</option>
          </select>
        </label>
      </div>

      {loading && <p className="status">Les documents se chargent…</p>}
      {error && <p className="status error">{error}</p>}

      <div className="archive-list">
        {filtered.map((row, index) => {
          const id = row.ID_archive || row.Nom_fichier || String(index);
          const selected = selectedId === id;
          return (
            <article
              key={id}
              className={`archive-card ${isLowConfidence(row.Niveau_confiance) ? "low-confidence" : ""}`}
            >
              <button
                className="card-trigger"
                onClick={() => setSelectedId(selected ? null : id)}
                aria-expanded={selected}
              >
                <span>
                  <strong>{row.Nom_fichier || "Document sans nom"}</strong>
                  <small>{row.ID_archive || "Référence non indiquée"}</small>
                </span>
                <span className="confidence">{row.Niveau_confiance || "à relire"}</span>
              </button>
              <div className="card-body">
                <dl className="meta-grid">
                  <div>
                    <dt>Date</dt>
                    <dd>{row.Date_document || "Pas encore précisée"}</dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>{row.Type_document || "Pas encore indiqué"}</dd>
                  </div>
                  <div>
                    <dt>À relire</dt>
                    <dd>{isYes(row.A_verifier) ? "Oui" : "Non"}</dd>
                  </div>
                </dl>
                <p>{row.Resume || "Aucun résumé n’est encore disponible."}</p>
                <h3>Personnes</h3>
                <Tags value={row.Personnes} />
                <h3>Lieux</h3>
                <Tags value={row.Lieux} />
                <h3>Thèmes</h3>
                <Tags value={row.Themes_mots_cles} />
                {row.Lien_Drive && (
                  <a className="source-link" href={row.Lien_Drive} target="_blank" rel="noreferrer">
                    Ouvrir l’image originale
                  </a>
                )}
              </div>
              {selected && (
                <div className="detail">
                  <h3>Voir la fiche du document</h3>
                  <div className="source-block">
                    <h4>Document source</h4>
                    <p>{row.Evenement || "Événement pas encore indiqué."}</p>
                  </div>
                  <div className="source-block">
                    <h4>Première transcription automatique</h4>
                    <p>{row.Transcription_brute || "Pas encore disponible."}</p>
                  </div>
                  <div className="source-block">
                    <h4>Transcription corrigée</h4>
                    <p>{row.Transcription_corrigee || "Pas encore disponible."}</p>
                  </div>
                  <div className="source-block">
                    <h4>Passages à relire et commentaires</h4>
                    <p>{row.Passages_incertains || row.Commentaires || "Aucun point particulier n’est signalé."}</p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
