import { Application } from "@prisma/client";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { CreateApplicationInput, UpdateApplicationInput } from "../types/application.types";
import { PaginationParams } from "../types/common.types";
import handleDBError from "./_handleDBError";

export async function createApplication(createAppInput: CreateApplicationInput): Promise<Application> {
  try{
    return await prisma.application.create({ data: { name: createAppInput.name } });
  }catch(error){
    handleDBError(error);
  }
}

export async function getAllApplications(filters: PaginationParams): Promise<Application[]> {
  const { page = 1, limit = 10, ...remainingFilters } = filters;
  const skip = (page - 1) * limit;
  
  return await prisma.application.findMany({where:{...remainingFilters}, skip, take: limit});
}

export async function getApplicationById(id: string): Promise<Application> {
  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
    throw ServiceError.notFound("Application not found.");
  }
  
  return application;
}

export async function updateApplication(id: string, updateAppInput: UpdateApplicationInput): Promise<Application> {
  try{
    const application = await prisma.application.update({ where: { id }, data: { ...updateAppInput } });
    return application;
  } catch(error){
    handleDBError(error);
  }
}

// TODO: deletion wont go through if there are users associated with the application
export async function deleteApplication(id: string): Promise<void> {
  try{
    await prisma.application.delete({ where: { id } });
  }catch(error){
    handleDBError(error);
  }
}