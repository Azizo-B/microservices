import { Employee } from "@prisma/client";
import { checkPermission } from "../core/auth";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { CreateEmployeeInput, EmployeeFilters, UpdateEmployeeInput } from "../types/employee.types";
import handleDBError from "./_handleDBError";

export async function createEmployee(createEmployeeInput: CreateEmployeeInput, userId?: string): Promise<Employee> {
  try {
    return await prisma.employee.create({ data: { ...createEmployeeInput, userId } });
  } catch (error) {
    handleDBError(error);
  }
}

export async function getAllEmployees(userId: string, filters: EmployeeFilters): Promise<Employee[]> {
  const {
    page = 0,
    limit = 10,
    email,
    companyId,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    ...remainingFilters
  } = filters;
  const skip = page * limit;

  if (!companyId && !(await checkPermission("companyservice:list:any:employees", userId))) {
    throw ServiceError.validationFailed("Company ID is required.");
  }

  if (companyId) {
    const employee = await prisma.employee.findFirst({ where: { userId, companyId } });
    if (!employee) throw ServiceError.notFound("Company not found."); // do not leak
  }

  return await prisma.employee.findMany({
    where: {
      ...remainingFilters,
      ...(companyId && { companyId }),
      ...(email && { email: { contains: email, mode: "insensitive" } }),
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    },
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder || "asc" } : undefined,
  });
}

async function doesUserHaveEmployeeInCompany(userId: string, companyId: string): Promise<boolean> {
  const count = await prisma.employee.count({
    where: { userId, companyId },
  });
  return count > 0;
}

async function getEmployeeAndCheckPermissions(
  userId: string,
  employeeId: string,
  requiredPermission: string
): Promise<Employee> {
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    throw ServiceError.notFound("Employee not found.");
  }

  const isRelated = await doesUserHaveEmployeeInCompany(userId, employee.companyId);
  const hasPermission = await checkPermission(requiredPermission, userId);

  if (!isRelated && !hasPermission) {
    throw ServiceError.notFound("Employee not found.");
  }

  return employee;
}

export async function getEmployeeById(userId: string, id: string): Promise<Employee> {
  return getEmployeeAndCheckPermissions(userId, id, "companyservice:view:any:employee");
}

export async function updateEmployee(
  userId: string,
  id: string,
  updateEmployeeInput: UpdateEmployeeInput
): Promise<Employee> {
  try {
    await getEmployeeAndCheckPermissions(userId, id, "companyservice:update:any:employee");
    return await prisma.employee.update({
      where: { id },
      data: updateEmployeeInput,
    });
  } catch (error) {
    handleDBError(error);
  }
}

export async function deleteEmployee(userId: string, id: string): Promise<void> {
  try {
    await getEmployeeAndCheckPermissions(userId, id, "companyservice:delete:any:employee");
    await prisma.employee.delete({ where: { id } });
  } catch (error) {
    handleDBError(error);
  }
}
