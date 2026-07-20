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
  const [lastSaved, setLastSaved] = useState(baselineSnapshot);

  // Resync the baseline whenever the caller recomputes it. This happens when
  // the store instance is recreated — e.g. a server action revalidates this
  // route and Next.js's Router Cache refreshes the page with new server data,
  // so the provider (keyed on `initialState`) builds a fresh store. Without
  // this resync, server-normalized fields that differ from what the client
  // submitted (or any store recreation unrelated to this button's own save)
  // could make `hasChanges` re-trigger against a stale baseline.
  useEffect(() => {
    setLastSaved(baselineSnapshot);
  }, [baselineSnapshot]);

  const hasChanges = currentSnapshot !== lastSaved;

  const markSaved = useCallback(() => {
    setLastSaved(currentSnapshot);
  }, [currentSnapshot]);

  const markReset = useCallback(() => {
    setLastSaved(baselineSnapshot);
  }, [baselineSnapshot]);

  return { hasChanges, markSaved, markReset };
}
