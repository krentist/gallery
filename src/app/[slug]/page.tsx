// ...existing code...
import dynamic from 'next/dynamic';
import { getAlbum, getAlbums } from '@/lib/api';
import Nav from '@/lib/nav';
import { titleToSlug, slugToAlbumTitle } from '@/lib/api/slug';
import { LocationIcon } from '@/lib/icons/location-icon';
import ClientDisplay from './ClientDisplay';

const Masonry = dynamic(() => import('@/lib/images/masonry'), {
  ssr: false
});

export async function generateStaticParams() {
  try {
    const items = await getAlbums();
    if (!Array.isArray(items)) return [];
    return items.map((it: any) => ({
      slug: it.slug ?? it.id ?? (it.title && String(it.title).toLowerCase().replace(/\s+/g, '-'))
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('generateStaticParams: failed to fetch items for this route:', err);
    return [];
  }
}

export default async function Page({ params: { slug } }: { params: { slug: string } }) {
  let albums: any[] = [];
  let album: any = { title: 'Album', description: '' };
  let photos: any[] = [];

  try {
    albums = (await getAlbums()) ?? [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch albums for nav:', err);
    albums = [];
  }

  try {
    const title = slugToAlbumTitle(slug);
    const result = await getAlbum(title);
    if (result) {
      album = result.album ?? album;
      photos = result.photos ?? [];
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch album for slug', slug, err);
    album = { title: 'Album not found', description: '' };
    photos = [];
  }

  const initialTags = (album as any).contentfulMetadata?.tags?.map((t: any) => t.name) || [];

  return (
    <section className="flex flex-col sm:flex-row sm:my-20" id="top">
      <div className="pt-10 sm:pl-10 sm:pr-20 lg:pl-20 lg:pr-40 space-y-1">
        <Nav albums={albums} title={album.title} />
      </div>

      <div className="flex flex-col items-start mt-6 w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">{album.title}</h1>
        {album.description && <p className="mb-4">{album.description}</p>}

        <ClientDisplay initialTags={initialTags} />

        <div className="my-12 w-full">
          <Masonry className="w-full" items={photos} />
        </div>
      </div>
    </section>
  );
}
// ...existing code...