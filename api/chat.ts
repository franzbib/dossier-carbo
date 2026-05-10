import OpenAI from "openai";
import Papa from "papaparse";

type Row = Record<string, string>;
type ApiRequest = {
  method?: string;
  body?: { question?: unknown };
};
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
};

const SPREADSHEET_ID =
  process.env.VITE_SPREADSHEET_ID || "1m6VkNpDqmdsWfeccenRA0PZwjMMfvYIMwDxG_4l4NI0";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_QUESTION_LENGTH = 800;

const SYSTEM_PROMPT =
  "Tu aides une famille à explorer une base d’archives concernant Clément Carbonnier. Tu réponds de façon claire, chaleureuse et prudente. Tu ne réponds qu’à partir des extraits fournis et tu ne complètes jamais par des connaissances extérieures. Tu distingues les faits attestés par les documents, les transcriptions automatiques, les résumés IA et les hypothèses prudentes. Si une information est incertaine, tu le dis clairement. Si la base ne permet pas de répondre, tu le dis. Tu cites toujours les documents utilisés par leur ID_archive ou leur Nom_fichier.";

const SHEETS = [
  "Archives",
  "Chronologie_biographique",
  "Points_a_verifier",
  "Synthese_biographique",
] as const;

function csvUrl(sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName,
  )}`;
}

async function loadSheet(sheetName: string): Promise<Row[]> {
  const response = await fetch(csvUrl(sheetName));
  if (!response.ok) {
    throw new Error(`Feuille inaccessible : ${sheetName}`);
  }

  const csv = await response.text();
  const parsed = Papa.parse<Row>(csv, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(`Erreur CSV : ${sheetName}`);
  }

  return parsed.data;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 2);
}

function rowLabel(sheetName: string, row: Row): string {
  return (
    row.ID_archive ||
    row.Nom_fichier ||
    row.Source_image ||
    row.Sources_images ||
    row.ID ||
    `${sheetName}`
  );
}

function rowText(sheetName: string, row: Row): string {
  if (sheetName === "Archives") {
    return [
      `Feuille: ${sheetName}`,
      `ID_archive: ${row.ID_archive || "non renseigné"}`,
      `Nom_fichier: ${row.Nom_fichier || "non renseigné"}`,
      `Date_document: ${row.Date_document || "non renseignée"}`,
      `Type_document: ${row.Type_document || "non renseigné"}`,
      `Niveau_confiance: ${row.Niveau_confiance || "non évalué"}`,
      `A_verifier: ${row.A_verifier || "non renseigné"}`,
      `Personnes: ${row.Personnes || ""}`,
      `Lieux: ${row.Lieux || ""}`,
      `Organisations: ${row.Organisations || ""}`,
      `Themes: ${row.Themes_mots_cles || ""}`,
      `Evenement: ${row.Evenement || ""}`,
      `Resume IA: ${row.Resume || ""}`,
      `Transcription brute automatique: ${row.Transcription_brute || ""}`,
      `Transcription corrigée: ${row.Transcription_corrigee || ""}`,
      `Passages incertains: ${row.Passages_incertains || ""}`,
    ].join("\n");
  }

  return [
    `Feuille: ${sheetName}`,
    `Document ou entrée: ${rowLabel(sheetName, row)}`,
    ...Object.entries(row).map(([key, value]) => `${key}: ${value}`),
  ].join("\n");
}

function scoreRow(questionTokens: string[], text: string): number {
  const normalized = normalize(text);
  return questionTokens.reduce((score, token) => {
    if (normalized.includes(token)) return score + (token.length > 5 ? 2 : 1);
    return score;
  }, 0);
}

async function buildContext(question: string): Promise<string> {
  const questionTokens = tokens(question);
  const allRows = await Promise.all(
    SHEETS.map(async (sheetName) => {
      const rows = await loadSheet(sheetName);
      return rows.map((row) => {
        const text = rowText(sheetName, row);
        return {
          sheetName,
          label: rowLabel(sheetName, row),
          text,
          score: scoreRow(questionTokens, text),
        };
      });
    }),
  );

  const ranked = allRows
    .flat()
    .sort((a, b) => b.score - a.score)
    .slice(0, 14);

  const useful = ranked.filter((item) => item.score > 0);
  const selected = useful.length > 0 ? useful : ranked.slice(0, 6);

  return selected
    .map((item, index) => {
      const clipped = item.text.length > 2600 ? `${item.text.slice(0, 2600)}…` : item.text;
      return `--- EXTRAIT ${index + 1} | ${item.sheetName} | ${item.label} ---\n${clipped}`;
    })
    .join("\n\n");
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Cette action n’est pas disponible ici." });
    return;
  }

  const question = String(req.body?.question || "").trim();
  if (!question) {
    res.status(400).json({ error: "Il manque une question à envoyer." });
    return;
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    res.status(400).json({
      error: "La question est un peu longue : essayons de la formuler plus simplement.",
    });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error:
        "Le chat n’est pas encore configuré côté serveur. Les autres pages restent consultables.",
    });
    return;
  }

  try {
    const context = await buildContext(question);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: MODEL,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Question: ${question}\n\nContexte documentaire disponible:\n${context}`,
        },
      ],
      temperature: 0.2,
    });

    res.status(200).json({
      answer:
        response.output_text ||
        "Je n’ai pas trouvé assez d’éléments dans les extraits transmis pour répondre prudemment.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Le chat n’a pas réussi à répondre. Cela peut venir d’un problème temporaire de connexion ou de configuration.",
    });
  }
}
