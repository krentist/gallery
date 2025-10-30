// src/app/[slug]/ClientDisplay.tsx

"use client";

// Change this line:
// import { useTags } from '@lib/hooks';

// To this (assuming your hooks are in src/lib/hooks/index.ts or src/lib/hooks.ts):
import { useTags } from '../../lib/hooks'; // <--- Corrected relative path

import React from 'react';

interface ClientDisplayProps {
  initialAlbumData: any;
  // ...
}

export default function ClientDisplayComponent({ initialAlbumData }: ClientDisplayProps) {
  const tags = useTags();

  return (
    <div>
      <p>Tags available: {tags ? tags.join(', ') : 'Loading tags...'}</p>
      <h2>Client-side content for {initialAlbumData.title}</h2>
    </div>
  );
}