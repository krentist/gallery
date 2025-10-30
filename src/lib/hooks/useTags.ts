// src/lib/hooks/useTags.ts

import { Album } from '@/types'; // Assuming '@/types' still works from lib
import { Tag } from '@types'; // Assuming Tag is defined in types or you need to define it

// Define Tag here if not globally available, or import it
type Tag = string; // Add this line if Tag isn't imported/defined

export function useTags(
  album: Pick<Album, 'date' | 'description' | 'locations'>
) {
  let tags = [];
  tags.push(album.date);
  for (const location of album.locations) {
    tags.push(location.date);
  }
  tags.push(album.description);
  for (const location of album.locations) {
    tags.push(location.description);
  }
  tags = tags.filter(Boolean) as string[];
  return tags;
}