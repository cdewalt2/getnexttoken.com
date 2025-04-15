import * as dotenv from 'dotenv';
dotenv.config();

console.log("✅ Loaded PAYLOAD_SECRET:", process.env.PAYLOAD_SECRET);

import payload from 'payload';
import next from 'next';
import express from 'express';

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

const payloadConfig = {
  secret: process.env.PAYLOAD_SECRET,
  db: {
    url: process.env.DATABASE_URI,
  },
  admin: {
    user: 'users',
    disableSSR: true,
    webpack: (config: any) => {
      config.resolve.fallback = { fs: false };
      return config;
    },
  },
  cors: ['http://137.184.80.109:3002'],
  collections: [
    {
      slug: 'pages',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'content', type: 'richText' }
      ]
    },
    {
      slug: 'blog',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'content', type: 'richText' },
        { name: 'publishedDate', type: 'date', required: true }
      ]
    },
    {
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
    }
  ],
  onInit: async () => {
    console.log('✅ Payload initialized');
  }
};

console.log('🧠 Payload.init config summary:', {
  secret: payloadConfig.secret,
  db: payloadConfig.db,
  admin: 'exists',
  collections: payloadConfig.collections.map(c => c.slug)
});

(async () => {
  await nextApp.prepare();
  await payload.init(payloadConfig as any);

  app.all('*', (req, res) => handle(req, res));

  app.listen(PORT, () => {
    console.log(`🚀 Unified hybrid app running at http://localhost:${PORT}`);
  });
})();
