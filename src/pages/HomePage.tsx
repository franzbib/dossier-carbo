export default function HomePage() {
  return (
    <section className="intro">
      <p className="eyebrow">Archives familiales</p>
      <h1>Archives Carbonnier-Clément</h1>
      <p className="lead">
        Un petit espace pour explorer ensemble les documents retrouvés autour de
        Clément Carbonnier.
      </p>
      <p className="lead">
        Ce site rassemble les premières transcriptions, notes et pistes de
        lecture issues des archives familiales. Il ne remplace pas la lecture des
        documents originaux : il sert surtout à s’y retrouver, à poser des
        questions, à suivre une chronologie et à repérer ce qui mérite d’être
        vérifié ensemble.
      </p>
      <div className="method-warning">
        <strong>À garder en tête</strong>
        <p>
          Les transcriptions ont été préparées avec l’aide d’un outil
          automatique. Elles sont utiles pour chercher et comprendre, mais elles
          peuvent contenir des erreurs. Pour toute conclusion importante, il faut
          revenir à l’image originale du document.
        </p>
      </div>
      <div className="home-grid">
        <article>
          <h2>Parcourir</h2>
          <p>
            Retrouver les documents, lire les fiches et ouvrir les images
            originales quand une lecture demande confirmation.
          </p>
        </article>
        <article>
          <h2>Relire</h2>
          <p>
            Repérer les noms, les lieux et les dates qui semblent sûrs, mais
            aussi les passages qui restent incertains.
          </p>
        </article>
        <article>
          <h2>Questionner</h2>
          <p>
            Poser une question aux archives indexées et obtenir une réponse qui
            indique les documents utilisés.
          </p>
        </article>
      </div>
    </section>
  );
}
