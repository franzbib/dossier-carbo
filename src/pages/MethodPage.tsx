const sections = [
  {
    title: "Transcription brute",
    body: "Texte produit automatiquement depuis l’image. Il peut contenir des erreurs de lecture, des omissions ou des confusions de noms propres.",
  },
  {
    title: "Transcription corrigée",
    body: "Version relue ou normalisée lorsque c’est possible. Elle reste dépendante de la lisibilité de l’image et doit être comparée à la source.",
  },
  {
    title: "Résumé IA",
    body: "Synthèse courte destinée à faciliter l’orientation dans la base. Elle ne remplace pas le document et ne constitue pas une preuve autonome.",
  },
  {
    title: "Niveau de confiance",
    body: "Indication qualitative sur la fiabilité probable de l’indexation. Un niveau faible ou non évalué appelle une vérification prioritaire.",
  },
  {
    title: "Images originales",
    body: "Toute conclusion importante doit revenir à l’image originale, car elle seule permet de contrôler la lecture, le contexte matériel et les signatures.",
  },
  {
    title: "Citation prudente",
    body: "Citer la base en mentionnant le nom du fichier ou l’ID_archive, le type de champ utilisé et, si nécessaire, la mention “transcription automatique à vérifier sur l’image originale”.",
  },
];

export default function MethodPage() {
  return (
    <section>
      <p className="eyebrow">Méthode</p>
      <h1>Lire la base avec prudence</h1>
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
