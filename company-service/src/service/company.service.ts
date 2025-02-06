import { Company } from "@prisma/client";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { PaginationParams } from "../types/common.types";
import { CreateCompanyInput, UpdateCompanyInput } from "../types/company.types";
import handleDBError from "./_handleDBError";

//TODO: access control for company routes
export async function createCompany(createCompanyInput: CreateCompanyInput): Promise<Company> {
  try {
    return await prisma.company.create({ data: { ...createCompanyInput } });
  } catch (error) {
    handleDBError(error);
  }
}

export async function getAllCompanies(filters: PaginationParams): Promise<Company[]> {
  const { page = 0, limit = 10, ...remainingFilters } = filters;
  const skip = page * limit;
  return await prisma.company.findMany({ where: { ...remainingFilters }, skip, take: limit });
}

export async function getCompanyById(id: string): Promise<Company> {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) throw ServiceError.notFound("Company not found.");
  return company;
}

export async function updateCompany(id: string, updateCompanyInput: UpdateCompanyInput): Promise<Company> {
  try {
    return await prisma.company.update({ where: { id }, data: { ...updateCompanyInput } });
  } catch (error) {
    handleDBError(error);
  }
}

export async function deleteCompany(id: string): Promise<void> {
  try {
    await prisma.company.delete({ where: { id } });
  } catch (error) {
    handleDBError(error);
  }
}
