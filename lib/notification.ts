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

function getUserNotificationDetailsKey

  /**
   * Retrieves usernotificationdetails data
   * 

function getUserNotificationDetailsKey(fid: number): string {
  return `${notificationServiceKey}:user:${fid}`;
}
  /**
   * Retrieves usernotificationdetails data
   * 

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

export async function deleteUserNotificationDetails(
  fid: number,
): Promise<void> {
  if (!redis) {
    return;
}
  await redis.del(getUserNotificationDetailsKey(fid));
}