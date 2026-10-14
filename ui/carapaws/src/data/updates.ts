import type { CareUpdate } from './types';

/** Preserve feed order for equal timestamps while finding each dog's latest update. */
export function getLatestUpdatesByDog(updates: CareUpdate[]): Map<string, CareUpdate> {
  const latest = new Map<string, CareUpdate>();
  for (const update of updates) {
    const previous = latest.get(update.dogId);
    if (!previous || update.timestamp.localeCompare(previous.timestamp) > 0) {
      latest.set(update.dogId, update);
    }
  }
  return latest;
}
