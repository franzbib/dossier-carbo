import { useEffect, useState } from "react";
import { loadSheet } from "../lib/sheets";
import type { SheetRow } from "../types";

type SheetState<T> = {
  rows: T[];
  loading: boolean;
  error: string | null;
};

export function useSheet<T extends SheetRow>(sheetName: string): SheetState<T> {
  const [state, setState] = useState<SheetState<T>>({
    rows: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState({ rows: [], loading: true, error: null });
    loadSheet<T>(sheetName)
      .then((rows) => {
        if (!cancelled) setState({ rows, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setState({ rows: [], loading: false, error: error.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sheetName]);

  return state;
}
