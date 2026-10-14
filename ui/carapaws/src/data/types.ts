export type Role = 'owner' | 'sitter';
export type UpdateType = 'Walk' | 'Meal' | 'Play' | 'Rest' | 'General';
export type FeedState = 'ready' | 'loading' | 'error';

export interface User {
  id: string;
  name: string;
  role: Role;
  initials: string;
}

export type OwnerContact = Pick<User, 'id' | 'name' | 'initials'> & { contact: string };

export interface SitterProfile {
  image?: string;
  userId: string;
  username: string;
  name: string;
  location: string;
  available: boolean;
  services: string[];
  contact: string;
  qualifications: string;
  referencePoints: string;
  references: { id: string; name: string; relationship: string; text: string }[];
}

export interface CareAssignment {
  id: string;
  dogId: string;
  sitterId: string;
}

export interface SitterRequest {
  id: string;
  dogId: string;
  sitterId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Dog {
  id: string;
  ownerId: string;
  name: string;
  image: string;
  breed: string;
  age: string;
  gender: 'Female' | 'Male';
  feeding: string;
  medical: string;
  emergency: { name: string; contact: string };
  loves: string[];
  dislikes: string[];
}

/** Photo-led care event; the photo is required and the text is optional. */
export interface CareUpdate {
  id: string;
  dogId: string;
  assignmentId: string;
  authorId: string;
  timestamp: string;
  image: string;
  type: UpdateType;
  text?: string;
}

export type NewUpdate = Pick<CareUpdate, 'dogId' | 'image' | 'type' | 'text'>;
