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
    throw new Error(
      "La base n’a pas pu être chargée pour le moment. Il faudra réessayer dans quelques instants.",
    );
  }

  const csv = await response.text();
  const parsed = Papa.parse<T>(csv, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(
      "La base a été reçue, mais sa lecture a échoué. Il faudra réessayer dans quelques instants.",
    );
  }

  return parsed.data;
}
