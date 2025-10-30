import ClientDisplay from './ClientDisplay';
import { getAlbums, getAlbum } from '@/lib/api';
import { Album } from '@/types/albums';

type Photo = {
  size: number;
  url: string;
  width: number;
  height: number;
};

export async function generateStaticParams() {
  try {
    const albums = await getAlbums();
    if (!Array.isArray(albums)) return [];
    return albums.map((album: Album) => ({ slug: album.slug }));
  } catch (err) {
    // Log and return an empty list so the build doesn't fail when the API is unreachable.
    // CI logs will show this message.
    // eslint-disable-next-line no-console
    console.error('generateStaticParams: failed to fetch albums:', err);
    return [];
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  let album: any = { title: 'Album not found', description: '' };
  let photos: Photo[] = [];

  try {
    const result = await getAlbum(params.slug);
    if (result) {
      album = result.album ?? album;
      photos = (result.photos as Photo[]) ?? [];
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Page: failed to fetch album data for slug', params.slug, err);
    // Keep album/photos as fallback values so the page still renders.
  }

  const initialTags =
    (album as any).contentfulMetadata?.tags?.map((tag: any) => tag.name) || [];

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">{album.title}</h1>
      {album.description && <p className="mb-4">{album.description}</p>}

      <ClientDisplay initialTags={initialTags} />

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((p) => (
          <div key={p.url} className="overflow-hidden rounded">
            <img
              src={p.url}
              width={p.width}
              height={p.height}
              alt={album.title ?? 'photo'}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </section>
    </main>
  );
}