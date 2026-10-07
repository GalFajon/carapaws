import { bookings, initialUpdates, sitter, sitterProfiles } from './mockData';
import type { CareUpdate, NewUpdate } from './types';

let updates = [...initialUpdates];
const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** In-memory adapter. Replace these methods with API calls when persistence exists. */
export const careService = {
  latestSitter(dogId: string) {
    const latest = bookings.filter((item) => item.dogId === dogId && Date.parse(item.startsAt) <= Date.now())
      .sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt))[0];
    return latest ? sitterProfiles.find((profile) => profile.userId === latest.sitterId) : undefined;
  },
  async getSitterProfile(userId: string) {
    await delay(300);
    return sitterProfiles.find((profile) => profile.userId === userId) ?? null;
  },
  async listUpdates(): Promise<CareUpdate[]> {
    await delay(450);
    return [...updates];
  },
  async createUpdate(input: NewUpdate): Promise<CareUpdate> {
    if (!input.image.trim()) throw new Error('Choose a photo before sharing your update.');
    const booking = bookings.find((item) => item.dogId === input.dogId);
    if (!booking) throw new Error('No care assignment was found for this dog.');
    await delay(500);
    const update: CareUpdate = {
      ...input, text: input.text?.trim(), id: crypto.randomUUID(),
      bookingId: booking.id, authorId: sitter.id,
      timestamp: new Date().toISOString(),
    };
    updates = [update, ...updates];
    return update;
  },
};
