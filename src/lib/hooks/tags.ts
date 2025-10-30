// ...existing code...
import { Album } from '@/types';

// Small utility to derive tags from an album.
// Note: not a React hook — name intentionally does NOT start with "use".
export function getTagsFromAlbum(
  album: Pick<Album, 'date' | 'description' | 'locations'>
): string[] {
  const tags: string[] = [];

  if (album.date) tags.push(album.date);
  if (album.description) tags.push(album.description);

  if (Array.isArray(album.locations)) {
    for (const location of album.locations) {
      if (location?.date) tags.push(location.date);
      if (location?.description) tags.push(location.description);
    }
  }

  return tags.filter(Boolean) as string[];
}
// ...existing code...