import payload from 'payload';

await payload.init({
  secret: 'test-secret',
  db: { url: 'mongodb://127.0.0.1/' },
  collections: [],
  onInit: async () => {
    console.log('✅ Payload started up with a minimal config');
  }
});
