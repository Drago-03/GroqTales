import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// In build mode, CI mode, or Vercel build, skip MongoDB connection entirely
if (
  process.env.NEXT_PUBLIC_BUILD_MODE === 'true' || 
  process.env.CI === 'true' || 
  process.env.VERCEL === '1' || 
  process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI
) {
  const mockClientPromise = Promise.resolve({
    db: () => ({
      collection: () => ({
        findOne: () => Promise.resolve(null),
        find: () => ({ toArray: () => Promise.resolve([]) }),
        insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
        updateOne: () => Promise.resolve({ modifiedCount: 1 }),
        deleteOne: () => Promise.resolve({ deletedCount: 1 }),
        createIndex: () => Promise.resolve(),
        drop: () => Promise.resolve(),
      }),
      createCollection: () => Promise.resolve(),
    }),
  } as any);
  
  export default mockClientPromise;
} else {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
  const uri = process.env.MONGODB_URI;
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  let client: MongoClient;
  let clientPromise: Promise<MongoClient>;

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  
  export default clientPromise;
}
