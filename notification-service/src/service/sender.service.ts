import { Sender } from "@prisma/client";
import { checkPermission } from "../core/auth";
import { encrypt } from "../core/encryption";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { PaginationParams } from "../types/common.types";
import { CreateSenderInput, UpdateSenderInput } from "../types/sender.types";
import handleDBError from "./_handleDBError";

export async function createSender(userId: string, createInput: CreateSenderInput): Promise<Sender> {
  try {
    const encryptedCredentials = await encrypt(JSON.stringify(createInput.credentials));
    return await prisma.sender.create({
      data: {
        userId,
        name: createInput.name,
        type: createInput.type,
        encryptedCredentials,
      },
    });
  } catch (error) {
    handleDBError(error);
  }
}

export async function getAllSenders(userId: string, filters: PaginationParams): Promise<Sender[]> {
  const { page = 0, limit = 10, ...remainingFilters } = filters;
  const skip = page * limit;

  const filter: any = { where: { ...remainingFilters }, skip, take: limit };

  const hasPermission = await checkPermission("notificationservice:list:any:sender", userId);
  if (!hasPermission) {
    filter.where.userId = userId;
  }

  return await prisma.sender.findMany(filter);
}

export async function getSenderById(userId: string, id: string): Promise<Sender> {
  const sender = await prisma.sender.findUnique({ where: { id } });

  if (!sender) {
    throw ServiceError.notFound("Sender not found.");
  }

  const hasPermission = await checkPermission("notificationservice:read:any:sender", userId);

  if (sender.userId !== userId && !hasPermission) {
    throw ServiceError.notFound("Sender not found."); // dont give away that sender exists
  }
  return sender;
}

export async function updateSender(userId: string, id: string, updateInput: UpdateSenderInput): Promise<Sender> {
  const sender = await prisma.sender.findUnique({ where: { id } });

  if (!sender) {
    throw ServiceError.notFound("Sender not found.");
  }

  const hasPermission = await checkPermission("notificationservice:update:any:sender", userId);

  if (sender.userId !== userId && !hasPermission) {
    throw ServiceError.notFound("Sender not found."); // dont give away that sender exists
  }

  try {
    const encryptedCredentials = await encrypt(JSON.stringify(updateInput.credentials));
    const updatedSender = await prisma.sender.update({
      where: { id },
      data: {
        name: updateInput.name,
        type: updateInput.type,
        encryptedCredentials,
      },
    });
    return updatedSender;
  } catch (error) {
    handleDBError(error);
  }
}

export async function deleteSender(userId: string, id: string): Promise<void> {
  const sender = await prisma.sender.findUnique({ where: { id } });

  if (!sender) {
    throw ServiceError.notFound("Sender not found.");
  }

  const hasPermission = await checkPermission("notificationservice:delete:any:sender", userId);

  if (sender.userId !== userId && !hasPermission) {
    throw ServiceError.notFound("Sender not found."); // dont give away that sender exists
  }

  try {
    await prisma.sender.delete({ where: { id } });
  } catch (error) {
    handleDBError(error);
  }
}
