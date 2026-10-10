import type { CareAssignment, CareUpdate, Dog, SitterProfile, User } from './types';

export const owner: User = { id: 'demo-owner', name: 'John Doe', role: 'owner', initials: 'JD' };
export const sitter: User = { id: 'demo-sitter', name: 'Jane Doe', role: 'sitter', initials: 'JD' };
export const demoSitters: User[] = [sitter,
  { id: 'demo-sitter-aisling', name: 'Aisling Murphy', role: 'sitter', initials: 'AM' },
  { id: 'demo-sitter-mark', name: 'Mark Byrne', role: 'sitter', initials: 'MB' },
];

export const sitterProfiles: SitterProfile[] = [{
  image: '/images/sitter-avatar.svg',
  userId: sitter.id, username: 'janedoe', name: sitter.name, location: 'Dublin', available: true,
  services: ['Dog walking', 'Day care'],
  contact: 'jane.sitter@example.com',
  qualifications: 'Canine first aid course (demo)\nDog care and handling workshop (demo)',
  referencePoints: 'Comfortable with daily feeding routines, gentle walks and nervous dogs. Regular photo updates to help owners feel connected.',
  reviews: [
    { id: 'review-1', reviewer: 'Demo owner A', rating: 5, feedback: 'Thoughtful care and lovely photo updates. Our dog settled in quickly.' },
    { id: 'review-2', reviewer: 'Demo owner B', rating: 4, feedback: 'Followed the feeding routine carefully and kept us informed after walks.' },
  ],
  references: [{ id: 'reference-1', name: 'Demo reference A', relationship: 'Previous dog-care client', text: 'Jane cared for our dog during a weekend away and shared regular updates.' }],
}, {
  userId: 'demo-sitter-aisling', username: 'aislingcares', name: 'Aisling Murphy', location: 'Dublin', available: true,
  services: ['Day care', 'Home sitting'], contact: 'aisling@example.com',
  qualifications: 'Experience caring for senior dogs (demo)',
  referencePoints: 'Patient with slower routines and dogs who need a calm setting.',
  reviews: [], references: [],
}, {
  userId: 'demo-sitter-mark', username: 'markwalks', name: 'Mark Byrne', location: 'Galway', available: false,
  services: ['Dog walking', 'Home sitting'], contact: 'mark@example.com',
  qualifications: 'Canine first aid course (demo)',
  referencePoints: 'Enjoys active walks and keeps owners updated with photos.',
  reviews: [], references: [],
}];

// Handles identify sitters in the demo directory; the eventual database needs a UNIQUE constraint.
if (new Set(sitterProfiles.map((profile) => profile.username.toLowerCase())).size !== sitterProfiles.length) {
  throw new Error('Demo sitter usernames must be unique.');
}

export const dog: Dog = {
  id: 'bailey', ownerId: owner.id, name: 'Bailey', image: '/images/bailey.jpg',
  breed: 'Golden Retriever', age: '4 years', gender: 'Male',
  feeding: '08:00 & 18:00 - One scoop of dry food. Fresh water throughout the day.',
  medical: 'Sensitive tummy. Please stick to his usual food and avoid chicken treats.',
  emergency: { name: `${owner.name} - owner`, contact: 'Contact details are a demo placeholder.' },
  loves: ['Tennis balls', 'Belly rubs', 'Long walks'],
  dislikes: ['Loud noises', 'The vacuum cleaner'],
};

export const dogs: Dog[] = [dog, {
  id: 'luna', ownerId: owner.id, name: 'Luna', image: '/images/rest.jpg',
  breed: 'Border Collie', age: '2 years', gender: 'Female',
  feeding: '07:30 & 18:30 - One scoop of her usual food. Fresh water throughout the day.',
  medical: 'No known medical needs in this demo.',
  emergency: { name: `${owner.name} - owner`, contact: 'Contact details are a demo placeholder.' },
  loves: ['Fetch', 'Gentle walks'], dislikes: ['Thunder'],
}];

export const assignments: CareAssignment[] = [
  { id: 'bailey-assignment', dogId: dog.id, sitterId: sitter.id },
  { id: 'luna-assignment', dogId: 'luna', sitterId: sitter.id },
];

const today = new Date();

export const samplePhotos = [
  { src: '/images/bailey.jpg', label: 'Garden portrait' },
  { src: '/images/walk.jpg', label: 'A little fresh air' },
  { src: '/images/rest.jpg', label: 'A quiet moment' },
];

// Relative times keep seed updates in the past regardless of the time of day.
export const initialUpdates: CareUpdate[] = [
  { id: 'luna-walk', dogId: 'luna', assignmentId: 'luna-assignment', authorId: sitter.id,
    timestamp: new Date(today.getTime() - 80 * 60_000).toISOString(),
    image: '/images/walk.jpg', type: 'Walk', text: 'Luna enjoyed a calm morning walk.' },
  { id: 'seed-walk', dogId: dog.id, assignmentId: 'bailey-assignment', authorId: sitter.id,
    timestamp: new Date(today.getTime() - 35 * 60_000).toISOString(),
    image: '/images/walk.jpg', type: 'Walk',
    text: 'A little fresh air. Bailey made a new friend on our walk — and found his favourite patch of sunshine. ☀️' },
  { id: 'seed-rest', dogId: dog.id, assignmentId: 'bailey-assignment', authorId: sitter.id,
    timestamp: new Date(today.getTime() - 150 * 60_000).toISOString(),
    image: '/images/rest.jpg', type: 'Rest',
    text: 'Settling in beautifully. Time for a quiet moment after all that exploring.' },
  { id: 'seed-meal', dogId: dog.id, assignmentId: 'bailey-assignment', authorId: sitter.id,
    timestamp: new Date(today.getTime() - 220 * 60_000).toISOString(),
    image: '/images/bailey.jpg', type: 'Meal',
    text: 'Breakfast has been enjoyed, his water bowl is topped up, and that happy face says it all.' },
];
