import type { Dog } from './types';

export const SITTER_PAGE_SIZE = 10;

/** Search the entire assigned list before paging; keep each owner's dogs adjacent. */
export function getDogListPage(dogs: Dog[], owners: { id: string; name: string }[], query: string, requestedPage: number, paginated: boolean) {
  const term = query.trim().toLocaleLowerCase();
  const matches = dogs.filter((dog) => dog.name.toLocaleLowerCase().includes(term)
    || (owners.find((owner) => owner.id === dog.ownerId)?.name ?? '').toLocaleLowerCase().includes(term));
  const ownerIds = [...new Set(matches.map((dog) => dog.ownerId))];
  const ordered = paginated ? ownerIds.flatMap((id) => matches.filter((dog) => dog.ownerId === id)) : matches;
  const pageCount = paginated ? Math.max(1, Math.ceil(ordered.length / SITTER_PAGE_SIZE)) : 1;
  const page = Math.max(1, Math.min(requestedPage, pageCount));
  const offset = paginated ? (page - 1) * SITTER_PAGE_SIZE : 0;
  const visible = paginated ? ordered.slice(offset, offset + SITTER_PAGE_SIZE) : ordered;
  const groups = [...new Set(visible.map((dog) => dog.ownerId))].map((id) => ({
    id,
    name: owners.find((owner) => owner.id === id)?.name ?? 'Unknown owner',
    dogs: visible.filter((dog) => dog.ownerId === id),
    continued: ordered.slice(0, offset).some((dog) => dog.ownerId === id),
  }));
  return { dogs: visible, groups, page, pageCount, total: ordered.length, offset };
}
