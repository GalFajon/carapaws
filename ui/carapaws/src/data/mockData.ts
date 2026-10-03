import type { CareBooking, CareUpdate, Dog, User } from './types';

export const owner: User = { id: 'demo-owner', name: 'John Doe', role: 'owner', initials: 'JD' };
export const sitter: User = { id: 'demo-sitter', name: 'Jane Doe', role: 'sitter', initials: 'JD' };

export const dog: Dog = {
  id: 'bailey', ownerId: owner.id, name: 'Bailey', image: '/images/bailey.jpg',
  breed: 'Golden Retriever', age: '4 years', gender: 'Male',
  feeding: '08:00 & 18:00 - One scoop of dry food. Fresh water throughout the day.',
  medical: 'Sensitive tummy. Please stick to his usual food and avoid chicken treats.',
  emergency: { name: `${owner.name} - owner`, contact: 'Contact details are a demo placeholder.' },
  loves: ['Tennis balls', 'Belly rubs', 'Long sniffy walks'],
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

export const pastCarers = [
  { id: 'past-carer-1', dogId: 'bailey', label: 'Past carer 1', initials: 'C1', lastCare: 'June 2026' },
  { id: 'past-carer-2', dogId: 'bailey', label: 'Past carer 2', initials: 'C2', lastCare: 'March 2026' },
  { id: 'past-carer-3', dogId: 'luna', label: 'Past carer 1', initials: 'C1', lastCare: 'May 2026' },
];

const today = new Date();
const at = (hour: number, minute: number, dayOffset = 0) => {
  const date = new Date(today);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const booking: CareBooking = {
  id: 'demo-booking', dogId: dog.id, sitterId: sitter.id,
  startsAt: at(8, 0, -1), endsAt: at(18, 0, 1),
};

export const bookings: CareBooking[] = [booking, {
  id: 'luna-booking', dogId: 'luna', sitterId: sitter.id,
  startsAt: at(8, 0, -1), endsAt: at(18, 0, 1),
}];

export const samplePhotos = [
  { src: '/images/bailey.jpg', label: 'Garden portrait' },
  { src: '/images/walk.jpg', label: 'A little fresh air' },
  { src: '/images/rest.jpg', label: 'A quiet moment' },
];

// Relative times keep seed updates in the past regardless of the time of day.
export const initialUpdates: CareUpdate[] = [
  { id: 'luna-walk', dogId: 'luna', bookingId: 'luna-booking', authorId: sitter.id,
    timestamp: new Date(today.getTime() - 80 * 60_000).toISOString(),
    image: '/images/walk.jpg', type: 'Walk', text: 'Luna enjoyed a calm morning walk.' },
  { id: 'seed-walk', dogId: dog.id, bookingId: booking.id, authorId: sitter.id,
    timestamp: new Date(today.getTime() - 35 * 60_000).toISOString(),
    image: '/images/walk.jpg', type: 'Walk',
    text: 'A little fresh air and a lot of sniffing. Bailey made a new friend on our walk — and found his favourite patch of sunshine. ☀️' },
  { id: 'seed-rest', dogId: dog.id, bookingId: booking.id, authorId: sitter.id,
    timestamp: new Date(today.getTime() - 150 * 60_000).toISOString(),
    image: '/images/rest.jpg', type: 'Rest',
    text: 'Settling in beautifully. Time for a quiet moment after all that exploring.' },
  { id: 'seed-meal', dogId: dog.id, bookingId: booking.id, authorId: sitter.id,
    timestamp: new Date(today.getTime() - 220 * 60_000).toISOString(),
    image: '/images/bailey.jpg', type: 'Meal',
    text: 'Breakfast has been enjoyed, his water bowl is topped up, and that happy face says it all.' },
];
