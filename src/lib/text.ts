export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function splitList(value?: string): string[] {
  return (value || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isYes(value?: string): boolean {
  return normalizeText(value) === "oui";
}

export function isLowConfidence(value?: string): boolean {
  const normalized = normalizeText(value);
  return normalized.includes("faible") || normalized.includes("non evalue");
}

export function looksCertainDate(value?: string): boolean {
  const text = normalizeText(value);
  if (!text || text.includes("incertain") || text.includes("non precise")) {
    return false;
  }
  return /\d{3,4}|\d{1,2}\s+[a-z]+/.test(text);
}
