import { UserAccount } from "@prisma/client";
import { prisma } from "../data";
import handleDBError from "./_handleDBError";

export async function createUserAccount(username: string, password: string, status: string, userId: string, appId: string ): Promise<UserAccount> {
    try{
        return await prisma.userAccount.create({ data: {
            username, password, status, userId, appId,
         }
        });
    }
    catch(error){
        handleDBError(error);
    }
}

export async function getAllUserAccounts(): Promise<UserAccount[]>{
    const userAccounts = await prisma.userAccount.findMany();
    return userAccounts;
}

export async function getUserAccountById(id: string): Promise<UserAccount | null>{
    const userAccount = await prisma.userAccount.findUnique({where: {id}});
    return userAccount;
}

export async function updateUserAccount(id: string, username: string, password: string, status: string): Promise<UserAccount>{
    const userAccount = await prisma.userAccount.update({where: {id}, data: {username, password, status}}); //idk of ik userid en appid ook moe update
    return userAccount; 
}

export async function deleteUserAccount(id:string): Promise<UserAccount> {
    const userAccount = await prisma.userAccount.delete({where: {id}});
    return userAccount;
}


