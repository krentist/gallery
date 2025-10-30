import ClientDisplay from './ClientDisplay';

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  // temporary server-side placeholder — replace with your real fetch later
  async function getTagsForSlug(slug: string): Promise<string[]> {
    return [];
  }

  const initialTags = await getTagsForSlug(params.slug);

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Slug: {params.slug}</h1>
      <ClientDisplay initialTags={initialTags} />
    </main>
  );
}