import type { CollectionConfig } from 'payload/types';

export const Blog: CollectionConfig = {
  slug: 'blog',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText' },
    { name: 'publishedDate', type: 'date', required: true }
  ]
};
