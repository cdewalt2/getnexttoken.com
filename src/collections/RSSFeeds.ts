import type { CollectionConfig } from 'payload/types';
export const RSSFeeds: CollectionConfig = {
  slug: 'rss_feeds',
  fields: [
    { name: 'sourceName', type: 'text', required: true },
    { name: 'sourceURL', type: 'text', required: true },
    {
      name: 'articles',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'publishedDate', type: 'date' }
      ]
    }
  ]
};
