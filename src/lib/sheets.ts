import Papa from "papaparse";
import type { SheetRow } from "../types";

const DEFAULT_SPREADSHEET_ID = "1m6VkNpDqmdsWfeccenRA0PZwjMMfvYIMwDxG_4l4NI0";

export const spreadsheetId =
  import.meta.env.VITE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;

export function sheetCsvUrl(sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName,
  )}`;
}

export async function loadSheet<T extends SheetRow>(sheetName: string): Promise<T[]> {
  const response = await fetch(sheetCsvUrl(sheetName));
  if (!response.ok) {
    throw new Error(`Impossible de charger la feuille ${sheetName}.`);
  }

  const csv = await response.text();
  const parsed = Papa.parse<T>(csv, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(`Erreur de lecture CSV pour la feuille ${sheetName}.`);
  }

  return parsed.data;
}
