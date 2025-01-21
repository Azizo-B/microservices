import { Notification } from "@prisma/client";
import { checkPermission } from "../core/auth";
import { decrypt } from "../core/encryption";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import processors from "../processor";
import { PaginationParams } from "../types/common.types";
import { CreateNotificationInput, NotificationStatus } from "../types/notification.types";
import handleDBError from "./_handleDBError";

// TODO: multiple recipients are allowed to be passed through
// recipient: [string, string, string] // Example usage
// TODO: template parameters and template id support
// TODO: attachments support
export async function createNotification(
  userId: string,
  createInput: CreateNotificationInput,
): Promise<Notification> {
  const { subject, body, recipient, type, senderId } = createInput;

  const processor = processors[type];
  if (!processor) {
    throw ServiceError.notFound(`Unsupported notification type: '${type}'`);
  }

  const sender = await prisma.sender.findUnique({ where: { id: senderId } });
  if (!sender) {
    throw ServiceError.notFound("Sender not found.");
  }

  const hasPermission = await checkPermission("notificationservice:use:any:sender", userId);
  if (sender.userId !== userId && !hasPermission) {
    throw ServiceError.notFound("Sender not found."); // Avoid revealing existence
  }
 
  try {
    const notification = await prisma.notification.create({
      data: { 
        type, userId, senderId, subject, body, recipient, status: NotificationStatus.PENDING, 
      },
    });
    const decryptedCredentials = await decrypt(sender.encryptedCredentials);
    return await processor(notification, JSON.parse(decryptedCredentials));
  } catch (error) {
    handleDBError(error);
  }
}

export async function getAllNotifications(userId: string, filters: PaginationParams): Promise<Notification[]> {
  const { page = 1, limit = 10, ...remainingFilters } = filters;
  const skip = (page - 1) * limit;

  const filter: any = { where: { ...remainingFilters }, skip, take: limit };

  const hasPermission = await checkPermission("notificationservice:list:any:notification", userId);
  if (!hasPermission) {
    filter.where.userId = userId;
  }

  return await prisma.notification.findMany(filter);
}

export async function getNotificationById(userId: string, id: string): Promise<Notification> {
  const notification = await prisma.notification.findUnique({ where: { id } });

  if (!notification) {
    throw ServiceError.notFound("Notification not found.");
  }

  const hasPermission = await checkPermission("notificationservice:read:any:notification", userId);

  if (notification.userId !== userId && !hasPermission) {
    throw ServiceError.notFound("Notification not found."); // Avoid revealing existence
  }
  return notification;
}

// TODO: update notifcation status to "read", "removed" etc.
export async function deleteNotification(userId: string, id: string): Promise<void> {
  const notification = await prisma.notification.findUnique({ where: { id } });

  if (!notification) {
    throw ServiceError.notFound("Notification not found.");
  }

  const hasPermission = await checkPermission("notificationservice:delete:any:notification", userId);

  if (notification.userId !== userId && !hasPermission) {
    throw ServiceError.notFound("Notification not found."); // Avoid revealing existence
  }

  try {
    await prisma.notification.delete({ where: { id } });
  } catch (error) {
    handleDBError(error);
  }
}
