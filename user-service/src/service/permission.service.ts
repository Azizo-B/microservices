import { Permission } from "@prisma/client";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { CreatePermissionInput, UpdatePermissionInput } from "../types/permission.types";
import handleDBError from "./_handleDBError";

export async function createPermission(createPermissionInput: CreatePermissionInput): Promise<Permission> {
  try {
    return await prisma.permission.create({
      data: {
        name: createPermissionInput.name,
        description: createPermissionInput.description,
      },
    });
  } catch (error) {
    handleDBError(error);
  }
}

export async function getAllPermissions(): Promise<Permission[]> {
  const permissions = await prisma.permission.findMany();
  return permissions;
}

export async function getPermissionById(id: string): Promise<Permission> {
  const permission = await prisma.permission.findUnique({ where: { id } });

  if (!permission) {
    throw ServiceError.notFound("Permission not found.");
  }

  return permission;
}

export async function updatePermission(id: string, updatePermissionInput: UpdatePermissionInput): Promise<Permission> {
  try {
    const permission = await prisma.permission.update({
      where: { id },
      data: {
        name: updatePermissionInput.name,
        description: updatePermissionInput.description,
      },
    });
    return permission;
  } catch (error) {
    handleDBError(error);
  }
}

export async function deletePermission(id: string): Promise<void> {
  try {
    await prisma.permission.delete({ where: { id } });
  } catch (error) {
    handleDBError(error);
  }
}
