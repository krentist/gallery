import { getFolder, getFolders } from '@/lib/api';
import { slugToFolderName, titleToSlug } from '@/lib/api/slug';
import Grid from '@/lib/images/pig-grid';
import Link from 'next/link';

export async function generateStaticParams() {
  try {
    // KEEP the same API function name that file previously called.
    // Example: const items = await getAlbums(); or await getFolders(); or await getTags();
    const items = await getFolders(); // <-- replace getAlbums() with the function already used in this file
    if (!Array.isArray(items)) return [];
    return items.map((it: any) => ({ slug: it.slug ?? it.id ?? (it.title && String(it.title).toLowerCase().replace(/\s+/g,'-')) }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('generateStaticParams: failed to fetch items for this route:', err);
    return [];
  }
}

async function Folder({ params: { slug } }: { params: { slug: string } }) {
  const name = slugToFolderName(slug);
  const { folder, photos } = await getFolder(name);

  return (
    <section className="flex flex-col justify-center sm:flex-row sm:my-20 sm:mt-48">
      <div className="max-sm:px-2 px-4 w-full max-w-6xl">
        <h1
          id="top"
          className="font-semibold tracking-tight text-4xl mb-16 w-full"
        >
          {folder.title}
        </h1>

        <Grid items={photos} />

        <div className="flex justify-between items-center text-gray-400 hover:text-gray-600">
          <a href="#top">↑ Go to top</a>
          <Link href="/folders">← Back to all folders</Link>
        </div>
      </div>
    </section>
  );
}

export default Folder;
