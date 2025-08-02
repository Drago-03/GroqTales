import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

/**
 * Retrieves db data
 */
export async function getDb() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  return db;
}
  /**
   * Retrieves collection data
   * 

export async function getCollection(collectionName: string) {
  const db = await getDb();
  return db.collection(collectionName);
}

/**
 * Find one document in a collection
 */
export async function findOne(collectionName: string, query: any) {
  try {
    const collection = await getCollection(collectionName);
    return await collection.findOne(query);
  } catch (error) {
    console.error('Error finding document:', error);
    throw error;
  }
}

/**
 * Find multiple documents in a collection
 */
export async function find(collectionName: string, query: any = {}, options: any = {}) {
  try {
    const collection = await getCollection(collectionName);
    return await collection.find(query, options).toArray();
  } catch (error) {
    console.error('Error finding documents:', error);
    throw error;
  }
}

/**
 * Insert one document into a collection
 */
export async function insertOne(collectionName: string, document: any) {
  try {
    const collection = await getCollection(collectionName);
    return await collection.insertOne(document);
  } catch (error) {
    console.error('Error inserting document:', error);
    throw error;
  }
}

/**
 * Update one document in a collection
 */
export async function updateOne(collectionName: string, query: any, update: any) {
  try {
    const collection = await getCollection(collectionName);
    return await collection.updateOne(query, update);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

/**
 * Delete one document from a collection
 */
export async function deleteOne(collectionName: string, query: any) {
  try {
    const collection = await getCollection(collectionName);
    return await collection.deleteOne(query);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}
  /**
   * Updates existing one
   * 

export async function updateOne(collectionName: string, query: any, update: any) {
  const collection = await getCollection(collectionName);
  return collection.updateOne(query, { $set: update });
}
  /**
   * Deletes one
   * 

export async function deleteOne(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return collection.deleteOne(query);
}
  /**
   * Creates new objectid
   */
export function createObjectId(id: string) {
  return new ObjectId(id);
}