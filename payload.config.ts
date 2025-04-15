type CollectionConfig = {
  slug: string;
  labels?: {
    singular?: string;
    plural?: string;
  };
  fields: any[];
  access?: any;
  admin?: any;
  hooks?: any;
  versions?: any;
  timestamps?: boolean;
};


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

export default {
  cors: ['http://137.184.80.109:3002'], // 👈 Frontend origin for CORS
  admin: {
    user: 'users',
    disableSSR: true,
    webpack: (config: any) => {
      config.resolve.fallback = { fs: false };
      return config;
    },
  },
  collections: [Pages, Blog, RSSFeeds],
};
