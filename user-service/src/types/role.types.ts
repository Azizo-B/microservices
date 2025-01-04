import { Role } from "@prisma/client";

export interface CreateRoleInput {
  name: string;
  description?: string;
}
  
export interface UpdateRoleInput {
  name: string;
  description?: string;
}
  
export interface RoleWithPermissions extends Role {
  permissions: string[]
}