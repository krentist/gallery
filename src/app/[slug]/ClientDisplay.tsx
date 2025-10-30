'use client';
import React from 'react';

export default function ClientDisplay({ initialTags }: { initialTags?: string[] }) {
  const tags = initialTags ?? [];

  function TagChip({ tag }: { tag: string }) {
    return (
      <span className="inline-block mr-2 mb-2 px-2 py-1 bg-gray-100 rounded text-sm">
        {tag}
      </span>
    );
  }

  return (
    <section className="flex flex-wrap gap-2 mt-4">
      {tags.length === 0 ? (
        <span className="text-sm text-gray-500">No tags</span>
      ) : (
        tags.map((t) => <TagChip key={t} tag={t} />)
      )}
    </section>
  );
}