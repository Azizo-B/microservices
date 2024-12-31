import { Application } from "@prisma/client";
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
  return application;
}

export async function updateApplication(id: string, name: string): Promise<Application> {
  const application = await prisma.application.update({ where: { id }, data: { name } });
  return application;
}

export async function deleteApplication(id: string): Promise<void> {
  await prisma.application.delete({ where: { id } });
}