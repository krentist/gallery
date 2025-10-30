// ...existing code...
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
  const albums = await getAlbums();
  return albums.map((album: Album) => ({
    slug: album.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { album, photos } = await getAlbum(params.slug);

  // Extract tags from album (based on repo's contentfulMetadata)
  const initialTags = (album as any).contentfulMetadata?.tags?.map((tag: any) => tag.name) || [];

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">{album.title}</h1>
      {album.description && <p className="mb-4">{album.description}</p>}

      {/* Client component receives only initialTags (matches ClientDisplay prop types) */}
      <ClientDisplay initialTags={initialTags} />

      {/* Render photos server-side so we don't need to change ClientDisplay */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(photos as Photo[]).map((p) => (
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
// ...existing code...