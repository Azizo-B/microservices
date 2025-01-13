import { Role } from "@prisma/client";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { CreateRoleInput, RoleWithPermissions, UpdateRoleInput } from "../types/role.types";
import handleDBError from "./_handleDBError";

export async function createRole(createRoleInput: CreateRoleInput): Promise<Role> {
  try {
    return await prisma.role.create({
      data: {
        name: createRoleInput.name,
        description: createRoleInput.description,
      },
    });
  } catch (error) {
    handleDBError(error);
  }
}

export async function getAllRoles(): Promise<Role[]> {
  const roles = await prisma.role.findMany();

  return roles;
}

export async function getRoleById(id: string): Promise<RoleWithPermissions> {
  const role = await prisma.role.findUnique({ 
    where: { id },
    include: { rolePermission: { include: { permission:true } } },
  });

  if (!role) {
    throw ServiceError.notFound("Role not found.");
  }

  return {
    ...role,
    permissions: role.rolePermission.map((rp) => 
      rp.permission.name,
    ),
  };
}

export async function updateRole(id: string, updateRoleInput: UpdateRoleInput): Promise<Role> {
  try {
    const role = await prisma.role.update({
      where: { id },
      data: {...updateRoleInput},
    });
    return role;
  } catch (error) {
    handleDBError(error);
  }
}

export async function deleteRole(id: string): Promise<void> {
  try {
    await prisma.role.delete({ where: { id } });
  } catch (error) {
    handleDBError(error);
  }
}

export async function assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
  try {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw ServiceError.notFound("Role not found.");
    }

    const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
    if (!permission) {
      throw ServiceError.notFound("Permission not found.");
    }

    const existingRolePermission = await prisma.rolePermission.findUnique({
      where: { idx_unique_role_permission:{ roleId, permissionId } },
    });
    if (existingRolePermission) {
      return; 
    }

    await prisma.rolePermission.create({ 
      data: { 
        role:{ 
          connect: { id: roleId }, 
        }, 
        permission:{
          connect:{ id: permissionId },
        }, 
      }, 
    });
  } catch (error) {
    handleDBError(error);
  }
}

export async function removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
  try {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw ServiceError.notFound("Role not found.");
    }

    const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
    if (!permission) {
      throw ServiceError.notFound("Permission not found.");
    }

    const rolePermission = await prisma.rolePermission.findUnique({
      where: { idx_unique_role_permission: { roleId, permissionId } },
    });
    if (!rolePermission) {
      return;
    }

    await prisma.rolePermission.delete({
      where: { idx_unique_role_permission: { roleId, permissionId } },
    });
  } catch (error) {
    handleDBError(error);
  }
}
