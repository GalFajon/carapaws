import { bookings, initialUpdates, sitter } from './mockData';
import type { CareUpdate, NewUpdate } from './types';

let updates = [...initialUpdates];
const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** In-memory adapter. Replace these methods with API calls when persistence exists. */
export const careService = {
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
