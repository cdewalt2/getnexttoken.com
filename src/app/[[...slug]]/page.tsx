import React from 'react';
import { notFound } from 'next/navigation';

export default async function CMSPage({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug?.join('/') || 'home';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/pages?where[slug][equals]=${slug}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();
  const page = data?.docs?.[0];

  if (!page) {
    return notFound();
  }

  return (
    <main className="prose mx-auto px-4 py-10">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.layout?.[0]?.richText || '' }} />
    </main>
  );
}
