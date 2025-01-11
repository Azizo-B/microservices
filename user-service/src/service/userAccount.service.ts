import { UserAccount } from "@prisma/client";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { UpdateUserAccountInput } from "../types/userAccount.types";
import { checkPermission } from "./user.service";

// userAccountService.ts
export async function createUserAccount(
  username: string, 
  passwordHash: string, 
  status: string, 
  userId: string, 
  appId: string,
): Promise<UserAccount> {
  const userAccount = await prisma.userAccount.create({
    data: {
      username,
      passwordHash, 
      status,
      userId,
      appId,
    },
  });

  return userAccount;
}

export async function getAllUserAccounts(userId: string): Promise<UserAccount[]>{
  let filter = {};
  if (! await checkPermission("userservice:list:any:useraccounts", userId)) {
    filter = {where: {userId}};
  }

  const userAccounts = await prisma.userAccount.findMany(filter);
  return userAccounts;

}

export async function getUserAccountById(id: string, requestingUserId: string): Promise<UserAccount>{
  const userAccount = await prisma.userAccount.findUnique({where: {id}});

  if(!userAccount){
    throw ServiceError.notFound("User account not found"); // Do not leak user information
  }
    
  if (id !== requestingUserId && ! await checkPermission("userservice:read:any:useraccounts", requestingUserId)) {
    throw ServiceError.notFound("User account not found"); // Do not leak user information
  }
  return userAccount;
}

export async function updateUserAccount(
  id: string, updateUserAccountInput: UpdateUserAccountInput,
): Promise<UserAccount>{
  const {username, status} = updateUserAccountInput;
  const userAccount = await prisma.userAccount.update({where: {id}, data: {username, status}}); 
  return userAccount; 
}

// TODO: add delete event on kafka for other services to consume
export async function deleteUserAccount(id:string): Promise<void> {
  await prisma.userAccount.update({where: {id}, data: {status: "inactive"}});
}