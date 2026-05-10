export default function HomePage() {
  return (
    <section className="intro">
      <p className="eyebrow">Base documentaire publique</p>
      <h1>Archives Carbonnier-Clément</h1>
      <p className="lead">
        Cette application permet de consulter une base d’images d’archives et
        leur indexation semi-automatique. Elle privilégie la lecture prudente des
        documents, la traçabilité des sources et la mise en évidence des points à
        contrôler.
      </p>
      <div className="method-warning">
        <strong>Avertissement méthodologique</strong>
        <p>
          Cette base est un outil d’indexation et d’exploration. Certaines
          transcriptions et synthèses ont été produites automatiquement à partir
          d’images par IA. Toute conclusion historique importante doit être
          vérifiée sur l’image originale.
        </p>
      </div>
      <div className="home-grid">
        <article>
          <h2>Consulter</h2>
          <p>
            Parcourir les fiches, filtrer les documents et ouvrir les images
            originales conservées sur Drive.
          </p>
        </article>
        <article>
          <h2>Comparer</h2>
          <p>
            Distinguer transcription brute, correction, résumé IA, confiance et
            passages incertains.
          </p>
        </article>
        <article>
          <h2>Interroger</h2>
          <p>
            Poser des questions à la base à partir d’extraits sélectionnés, avec
            citations des documents utilisés.
          </p>
        </article>
      </div>
    </section>
  );
}
