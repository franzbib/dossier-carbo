# Archives Carbonnier-Clément

Application web publique de consultation documentaire pour la base « Archives Carbonnier-Clément ».

Le site lit un Google Sheet public en lecture seule, affiche les archives indexées, la chronologie, les points à vérifier, et propose une interface de chat côté serveur via `/api/chat`.

## Installation locale

```bash
npm install
cp .env.example .env
npm run dev
```

Puis ouvrir l’URL indiquée par Vite.

## Configuration

Variables d’environnement :

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
VITE_SPREADSHEET_ID=1m6VkNpDqmdsWfeccenRA0PZwjMMfvYIMwDxG_4l4NI0
```

`OPENAI_API_KEY` doit rester côté serveur. Elle n’est jamais utilisée dans le frontend.

## Déploiement Vercel

1. Importer le projet dans Vercel.
2. Ajouter les variables d’environnement dans les paramètres du projet.
3. Déployer avec la commande de build par défaut :

```bash
npm run build
```

Vercel expose automatiquement la route serveur `api/chat.ts` sous `/api/chat`.

## Structure du projet

- `src/pages` : pages React de consultation.
- `src/lib/sheets.ts` : lecture CSV publique du Google Sheet.
- `src/lib/text.ts` : normalisation, listes et aides de filtrage.
- `src/hooks/useSheet.ts` : hook de chargement des feuilles.
- `api/chat.ts` : route backend Vercel pour interroger la base avec OpenAI.
- `src/styles.css` : styles sobres et maintenables.

## Limites méthodologiques

Cette base est un outil d’indexation et d’exploration. Certaines transcriptions et synthèses ont été produites automatiquement à partir d’images par IA. Toute conclusion historique importante doit être vérifiée sur l’image originale.

Le chat répond uniquement à partir d’extraits sélectionnés dans la base. Si les extraits ne suffisent pas, il doit le signaler. Les réponses doivent citer les documents utilisés par `ID_archive` ou `Nom_fichier` et mentionner les incertitudes.

## Coût OpenAI

Chaque question envoyée à `/api/chat` déclenche un appel à l’API OpenAI. Le coût dépend du modèle configuré dans `OPENAI_MODEL`, du volume d’extraits transmis et du nombre d’utilisateurs.

## Futures améliorations possibles

- Pagination et tri avancé des archives.
- Index de recherche pré-calculé pour de meilleures performances.
- Affichage groupé par lot de traitement.
- Export CSV des résultats filtrés.
- Citations plus structurées dans les réponses du chat.
- Cache serveur court pour réduire les appels au Google Sheet.
