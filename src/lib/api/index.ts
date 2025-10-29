import { Client } from './client';

// Helper function to slugify a string
// This function will convert "Cote D'Azur" into "cote-d-azur"
function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Normalize diacritics (e.g., é -> e)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars (except -)
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export async function getAlbums() {
  const client = new Client();
  console.log("Attempting to fetch albums...");
  const data = await client.albums.get();

  console.log("Full data object received from Contentful client:", data);

  if (data.success) {
    const albums = data.data.photoGalleryCollection.items;
    return [...albums].sort((a, b) => a.order - b.order);
  }

  console.error("Failed to fetch albums from Contentful: data.success was false.");
  throw new Error('Failed to fetch albums');
}

export async function getAlbum(slug: string) {
  // MODIFIED: Slugify the incoming slug from the URL
  const processedSlug = slugify(slug);

  const client = new Client();
  // Pass the already slugified string to the client
  const data = await client.album(processedSlug).get(); // Use processedSlug here!
  
  console.log('Original slug from URL: ', slug);
  console.log('Processed slug for Contentful query: ', processedSlug); // Check this value!
  console.log('Fetched album data: ', data);
  
  if (data.success) {
    if (data.data.photoGalleryCollection.items.length === 0) {
      console.error('No album found for slug: ', processedSlug); // Use processedSlug in error too
      throw new Error(`No album found for slug ${processedSlug}`);
    }
    const album = data.data.photoGalleryCollection.items[0];
    const photos = album.photosCollection.items;
    return { album, photos };
  }
  throw new Error(`Failed to fetch album ${processedSlug}`);
}

export async function getPhotos(tag: string) {
  const client = new Client();
  const data = await client.photos.findBy(tag);
  if (data.success) {
    const photos = data.data.assetCollection.items;
    return photos;
  }
  throw new Error(`Failed to fetch photos tagged '${tag}'`);
}

export async function getFolders() {
  const client = new Client();
  const data = await client.folders.get();
  if (data.success) {
    const folders = data.data.photoFoldersCollection.items;
    return [...folders].sort((a, b) => a.order - b.order);
  }
  throw new Error('Failed to fetch folders');
}

export async function getFolder(folder: string) {
  // If you also use slugs for folders, you'd apply slugify here too:
  // const processedFolderSlug = slugify(folder);
  // const data = await client.folder(processedFolderSlug).get();

  const client = new Client();
  const data = await client.folder(folder).get(); // Using original folder name for now
  if (data.success) {
    const folder = data.data.photoFoldersCollection.items[0];
    const photos = folder.photosCollection.items;
    return { folder, photos };
  }
  throw new Error(`Failed to fetch folder '${folder}'`);
}