import { Client } from "@prisma/client";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { ClientFilters, CreateClientInput, UpdateClientInput } from "../types/client.types";
import handleDBError from "./_handleDBError";

//TODO: access control for client routes
export async function createClient(createClientInput: CreateClientInput): Promise<Client> {
  try {
    return await prisma.client.create({ data: { ...createClientInput } });
  } catch (error) {
    handleDBError(error);
  }
}

export async function getAllClients(filters: ClientFilters): Promise<Client[]> {
  const { page = 0, limit = 10, name, startDate, endDate, sortBy, sortOrder, ...remainingFilters } = filters;
  const skip = page * limit;

  return await prisma.client.findMany({
    where: {
      ...remainingFilters,
      ...(name && {
        name: {
          contains: name,
          mode: "insensitive",
        },
      }),
      createdAt: {
        ...(startDate && {
          gte: new Date(startDate),
        }),
        ...(endDate && {
          lte: new Date(endDate),
        }),
      },
    },
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder || "asc" } : undefined,
  });
}

export async function getClientById(id: string): Promise<Client> {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) throw ServiceError.notFound("Client not found.");
  return client;
}

export async function updateClient(id: string, updateClientInput: UpdateClientInput): Promise<Client> {
  try {
    return await prisma.client.update({ where: { id }, data: { ...updateClientInput } });
  } catch (error) {
    handleDBError(error);
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    await prisma.client.delete({ where: { id } });
  } catch (error) {
    handleDBError(error);
  }
}
