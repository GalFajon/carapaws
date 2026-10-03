export type Role = 'owner' | 'sitter';
export type UpdateType = 'Walk' | 'Meal' | 'Play' | 'Rest' | 'General';
export type FeedState = 'ready' | 'loading';

export interface User {
  id: string;
  name: string;
  role: Role;
  initials: string;
}

export interface Dog {
  id: string;
  ownerId: string;
  name: string;
  image: string;
  breed: string;
  age: string;
  gender: string;
  feeding: string;
  medical: string;
  emergency: { name: string; contact: string };
  loves: string[];
  dislikes: string[];
}

export interface CareBooking {
  id: string;
  dogId: string;
  sitterId: string;
  startsAt: string;
  endsAt: string;
}

/** Photo-led care event; the photo is required and the text is optional. */
export interface CareUpdate {
  id: string;
  dogId: string;
  bookingId: string;
  authorId: string;
  timestamp: string;
  image: string;
  type: UpdateType;
  text?: string;
}

export type NewUpdate = Pick<CareUpdate, 'dogId' | 'image' | 'type' | 'text'>;
