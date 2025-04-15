import type { CollectionConfig } from 'payload/types';

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText' }
  ]
};

const Blog: CollectionConfig = {
  slug: 'blog',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText' },
    { name: 'publishedDate', type: 'date', required: true }
  ]
};

const RSSFeeds: CollectionConfig = {
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

const config ={
  collections: [Pages, Blog, RSSFeeds],
  cors: ['http://137.184.80.109:3002'],
  admin: {
    user: 'users',
    disableSSR: true,
    webpack: (config: any) => {
      config.resolve.fallback = { fs: false };
      return config;
    },
  },
};

export default config;
