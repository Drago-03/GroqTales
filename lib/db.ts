/**

import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

  /**
   * Retrieves db data
   * 

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
} findOne

export async function findOne(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return collection.findOne(query);
}
export async function find(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return collection.find(query).toArray();
}
export async function insertOne(collectionName: string, document: any) {
  const collection = await getCollection(collectionName);
  return collection.insertOne(document);
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
   * 

export function createObjectId(id: string) {
  return new ObjectId(id);
}