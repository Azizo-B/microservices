import { Application } from "@prisma/client";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import handleDBError from "./_handleDBError";

export async function createApplication(name: string): Promise<Application> {
  try{
    return await prisma.application.create({ data: { name } });
  }catch(error){
    handleDBError(error);
  }
}

export async function getAllApplications(): Promise<Application[]> {
  const applications = await prisma.application.findMany();
  return applications;
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
    throw ServiceError.notFound("Application not found.");
  }
  
  return application;
}

export async function updateApplication(id: string, name: string): Promise<Application> {
  try{
    const application = await prisma.application.update({ where: { id }, data: { name } });
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