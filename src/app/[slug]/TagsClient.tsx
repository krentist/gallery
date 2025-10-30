'use client';
import React from 'react';

export default function TagsClient({ initialTags }: { initialTags?: string[] }) {
  const tags = initialTags ?? [];
  return (
    <div>
      {tags.map((t) => (
        <span key={t} className="mr-2 text-sm text-gray-600">
          {t}
        </span>
      ))}
    </div>
  );
}
