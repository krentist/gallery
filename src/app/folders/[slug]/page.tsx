// ...existing code...
export async function generateStaticParams() {
  // If running in CI (or GitHub Actions) or Contentful env vars are missing,
  // return an empty array so the build won't attempt network fetches.
  if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' || !process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return [];
  }

  try {
    const items = await getFolders(); // keep the same API call your file used
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
// ...existing code...