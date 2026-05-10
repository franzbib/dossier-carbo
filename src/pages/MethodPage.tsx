const sections = [
  {
    title: "Un outil de travail familial",
    body: "Cette base aide à classer les documents, à retrouver les noms, les lieux et les dates, et à formuler des questions. Elle ne constitue pas une édition définitive des archives.",
  },
  {
    title: "Première transcription",
    body: "Texte préparé automatiquement à partir de l’image. Il permet de chercher dans les documents, mais il peut contenir des erreurs de lecture, des omissions ou des confusions de noms propres.",
  },
  {
    title: "Transcription relue",
    body: "Version corrigée ou normalisée lorsque c’est possible. Elle reste dépendante de la lisibilité de l’image et doit être comparée au document original.",
  },
  {
    title: "Résumé automatique",
    body: "Court résumé destiné à aider l’orientation dans le dossier. Il ne remplace pas le document et ne constitue pas une preuve autonome.",
  },
  {
    title: "Degré de confiance",
    body: "Indication simple sur la fiabilité probable de la lecture. Un niveau faible ou non évalué signifie qu’il faut relire l’image originale avec attention.",
  },
  {
    title: "Images originales",
    body: "Pour toute conclusion importante, l’image originale reste la référence. Elle seule permet de vérifier la lecture, le contexte matériel, les signatures et les détails du document.",
  },
  {
    title: "Citation prudente",
    body: "Pour citer une information, mentionner le nom du fichier ou l’ID_archive, puis préciser si elle vient d’une transcription, d’un résumé ou d’une relecture. En cas de doute, ajouter que la lecture doit être vérifiée sur l’image originale.",
  },
];

export default function MethodPage() {
  return (
    <section>
      <p className="eyebrow">Méthode</p>
      <h1>Comment lire cette base ?</h1>
      <p className="page-intro">
        L’objectif est d’aider la famille à avancer dans le dossier sans aller
        plus vite que les documents. Les outils automatiques sont utiles, mais
        les archives originales restent le point d’appui.
      </p>
      <div className="method-list">
        {sections.map((section) => (
          <article key={section.title} className="panel">
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
