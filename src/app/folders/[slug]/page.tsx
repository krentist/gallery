// ...existing code...
import Link from 'next/link';
import { getFolders } from '@/lib/api';
import { titleToSlug } from '@/lib/api/slug';

export async function generateStaticParams() {
  // Avoid network calls in CI or when Contentful env vars are missing
  if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' || !process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return [];
  }

  try {
    const items = await getFolders();
    if (!Array.isArray(items)) return [];
    return items.map((it: any) => ({
      slug: it.slug ?? it.id ?? (it.title && String(it.title).toLowerCase().replace(/\s+/g, '-'))
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('generateStaticParams (folders/[slug]): failed to fetch folders:', err);
    return [];
  }
}

export default async function Page({ params }: { params: { slug: string } }): Promise<JSX.Element> {
  const slug = params.slug;
  let folder: any = { title: 'Folder', date: '', description: '' };
  let folders: any[] = [];

  const skipRemote = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' || !process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN;
  if (skipRemote) {
    return (
      <main>
        <h1 className="text-2xl font-bold mb-4">Folder: {slug}</h1>
        <p className="text-sm text-gray-600 mb-4">Remote data skipped in CI / missing env.</p>
        <div>
          <Link href="/folders">Back to folders</Link>
        </div>
      </main>
    );
  }

  try {
    const data = await getFolders();
    if (Array.isArray(data)) {
      folders = data;
      const found = data.find((f: any) => (f.slug ?? titleToSlug(f.title)) === slug);
      if (found) folder = found;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Page (folders/[slug]): failed to fetch folder data:', err);
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">{folder.title ?? slug}</h1>
      {folder.description && <p className="mb-4">{folder.description}</p>}
      <div className="text-sm text-gray-600 mb-6">
        <Link href="/folders">← Back to folders</Link>
      </div>

      <section className="grid gap-4">
        {folders.map((f) => (
          <Link key={f.title ?? f.slug} href={`/folders/${titleToSlug(f.title ?? f.slug)}`} className="text-blue-600">
            {f.title}
          </Link>
        ))}
      </section>
    </main>
  );
}
// ...existing code...