/**
 * @fileoverview Core application functionality
 * @module lib.notification.ts
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import type { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { redis } from "./redis";

const notificationServiceKey =
  process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? "minikit";

  /**
   * Retrieves usernotificationdetailskey data
   * 
   * @  /**
   * Retrieves usernotificationdetails data
   * 
   * @function getUserNotificationDetails
   * @returns {void|Promise<void>} Function return value
   */
function getUserNotificationDetailsKey
   * @returns {void|Promise<void>} Function return value
   */


  /**
   * Retrieves usernotificationdetails data
   * 
   * @function getUserNotificationDetails
   * @returns {void|Promise<void>} Function return value
   */



function getUserNotificationDetailsKey(fid: number): string {
  return `${notificationServiceKey}:user:${fid}`;
}

  /**
   * Retrieves usernotificationdetails data
   * 
   * @function getUserNotificationDetails
   * @returns {void|Promise<void>} Function return value
   */


export async function getUserNotificationDetails(
  fid: number,
): Promise<FrameNotificationDetails | null> {
  if (!redis) {
    return null;
  }

  return await redis.get(
    getUserNotificationDetailsKey(fid),
  );
}

  /**
   * Sets usernotificationdetails value
   * 
   * @function setUserNotificationDetails
   * @returns {void|Promise<void>} Function return value
   */


export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails,
): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
}

  /**
   * Deletes usernotificationdetails
   * 
   * @function deleteUserNotificationDetails
   * @returns {void|Promise<void>} Function return value
   */


export async function deleteUserNotificationDetails(
  fid: number,
): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.del(getUserNotificationDetailsKey(fid));
} 