import { initialUpdates, sitterProfiles } from './mockData';
import type { CareAssignment, CareUpdate, NewUpdate } from './types';

let updates = [...initialUpdates];
const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** In-memory adapter. Replace these methods with API calls when persistence exists. */
export const careService = {
  async getSitterProfile(userId: string) {
    await delay(300);
    return sitterProfiles.find((profile) => profile.userId === userId) ?? null;
  },
  async listUpdates(): Promise<CareUpdate[]> {
    await delay(450);
    return [...updates];
  },
  async createUpdate(input: NewUpdate, assignment: CareAssignment, authorId: string): Promise<CareUpdate> {
    if (!input.image.trim()) throw new Error('Choose a photo before sharing your update.');
    if (assignment.dogId !== input.dogId || assignment.sitterId !== authorId) throw new Error('No care assignment was found for this dog.');
    await delay(500);
    const update: CareUpdate = {
      ...input, text: input.text?.trim(), id: crypto.randomUUID(),
      assignmentId: assignment.id, authorId,
      timestamp: new Date().toISOString(),
    };
    updates = [update, ...updates];
    return update;
  },
};
