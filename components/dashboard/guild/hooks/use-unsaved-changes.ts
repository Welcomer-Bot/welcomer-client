import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared "unsaved changes" tracking used by both editor save buttons (the
 * message editor and the image card editor). Both compare a normalized JSON
 * snapshot of the current store state against a last-saved baseline; only
 * the fields that go into the snapshot and the store/action wired around it
 * differ between the two callers, so the snapshot computation itself stays
 * with the caller (via `useMemo`) and this hook only owns the comparison
 * bookkeeping.
 *
 * @param currentSnapshot Normalized (e.g. `JSON.stringify`'d) snapshot of the
 *   live state, recomputed by the caller whenever the tracked fields change.
 * @param baselineSnapshot Normalized snapshot of the store's initial state
 *   (`store.getInitialState()`), recomputed by the caller whenever the store
 *   instance itself changes.
 */
export function useUnsavedChanges(
  currentSnapshot: string,
  baselineSnapshot: string,
) {
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Resync the baseline whenever the caller recomputes it. This happens when
  // the store instance is recreated — e.g. a server action revalidates this
  // route and Next.js's Router Cache refreshes the page with new server data,
  // so the provider (keyed on `initialState`) builds a fresh store. Without
  // this resync, server-normalized fields that differ from what the client
  // submitted (or any store recreation unrelated to this button's own save)
  // could make `hasChanges` re-trigger against a stale baseline.
  useEffect(() => {
    lastSavedSnapshotRef.current = baselineSnapshot;
  }, [baselineSnapshot]);

  useEffect(() => {
    if (lastSavedSnapshotRef.current !== null) {
      setHasChanges(currentSnapshot !== lastSavedSnapshotRef.current);
    }
  }, [currentSnapshot]);

  const markSaved = useCallback(() => {
    lastSavedSnapshotRef.current = currentSnapshot;
    setHasChanges(false);
  }, [currentSnapshot]);

  const markReset = useCallback(() => {
    lastSavedSnapshotRef.current = baselineSnapshot;
    setHasChanges(false);
  }, [baselineSnapshot]);

  return { hasChanges, markSaved, markReset };
}
