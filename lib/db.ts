/**
 * @fileoverview Core application functionality
 * @module lib.db.ts
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

  /**
   * Retrieves db data
   * 
   * @function getDb
   * @returns {void|Promise<void>} Function return value
   */


export async function getDb() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  return db;
}

  /**
   * Retrieves collection data
   * 
   * @function getCollection
   * @returns {void|Promise<void>} Function return value
   */


export async function getCollection(collectionName: string) {
  const db = await getDb();
  return db.collection(collectionName);
}

  /**
   * Implements findOne functionality
   * 
   * @  /**
   * Implements find functionality
   * 
   * @function find
   * @returns {void|Promise<void>} Function return value
   */
function findOne
   * @returns {void|Promise<void>} Function return value
   */


  /**
   * Implements find functionality
   * 
   * @function find
   * @returns {void|Promise<void>} Function return value
   */



export async function findOne(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return collection.findOne(query);
}

  /**
   * Implements find functionality
   * 
   * @function find
   * @returns {void|Promise<void>} Function return value
   */


export async function find(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return collection.find(query).toArray();
}

  /**
   * Implements insertOne functionality
   * 
   * @function insertOne
   * @returns {void|Promise<void>} Function return value
   */


export async function insertOne(collectionName: string, document: any) {
  const collection = await getCollection(collectionName);
  return collection.insertOne(document);
}

  /**
   * Updates existing one
   * 
   * @function updateOne
   * @returns {void|Promise<void>} Function return value
   */


export async function updateOne(collectionName: string, query: any, update: any) {
  const collection = await getCollection(collectionName);
  return collection.updateOne(query, { $set: update });
}

  /**
   * Deletes one
   * 
   * @function deleteOne
   * @returns {void|Promise<void>} Function return value
   */


export async function deleteOne(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return collection.deleteOne(query);
}

  /**
   * Creates new objectid
   * 
   * @function createObjectId
   * @returns {void|Promise<void>} Function return value
   */


export function createObjectId(id: string) {
  return new ObjectId(id);
} 