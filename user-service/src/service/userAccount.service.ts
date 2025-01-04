import { UserAccount } from "@prisma/client";
import { prisma } from "../data";
import handleDBError from "./_handleDBError";
import { CreateUserAccountInput, UpdateUserAccountInput } from "../types/userAccount.types";
import { checkPermission } from "./user.service";
import ServiceError from "../core/serviceError";


// userAccountService.ts
export async function createUserAccount(
    username: string, 
    passwordHash: string, 
    status: string, 
    userId: string, 
    appId: string
): Promise<UserAccount> {
    const userAccount = await prisma.userAccount.create({
        data: {
            username,
            passwordHash, 
            status,
            userId,
            appId
        }
    });

    return userAccount;
}


export async function getAllUserAccounts(requestingUserId: string, userId: string): Promise<UserAccount[]>{
    userId= userId === "me" ? requestingUserId : userId;
    
      if (userId !== requestingUserId && ! await checkPermission("userservice:list:any:useraccounts", requestingUserId)) {
        throw ServiceError.notFound("User not found"); // Do not leak user information
      }
    

    const userAccounts = await prisma.userAccount.findMany({where: {id: userId} });
    return userAccounts;

}


export async function getUserAccountById(id: string): Promise<UserAccount | null>{
    const userAccount = await prisma.userAccount.findUnique({where: {id}});
    return userAccount;
}

export async function updateUserAccount(id: string, UpdateUserAccountInput: UpdateUserAccountInput): Promise<UserAccount>{
    const {username, status} = UpdateUserAccountInput;
    const userAccount = await prisma.userAccount.update({where: {id}, data: {username, status}}); //idk of ik userid en appid ook moe update
    return userAccount; 
}

export async function deleteUserAccount(id:string): Promise<UserAccount> {
    const userAccount = await prisma.userAccount.update({where: {id}, data: {status: 'inactive'}});
    return userAccount;
}


