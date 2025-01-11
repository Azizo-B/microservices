import { UserAccount } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import { requireAuthentication } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation } from "../core/validation"; // You may use this to validate inputs
import * as userAccountService from "../service/userAccount.service";
import { EntityId, ListResponse } from "../types/common.types";
import {
  AccountStatus,
  UpdateUserAccountInput,
} from "../types/userAccount.types"; // Import types

async function getAllUserAccounts(
  req :Request<EntityId>, res: Response<ListResponse<UserAccount>>, next: NextFunction,
) {
  try{
    const userAccount = await userAccountService.getAllUserAccounts(req.userId); 
    res.send({items: userAccount});
  } catch(error){
    next(error);
  }
}

getAllUserAccounts.validationSchema = {
  params: {
    userId: objectIdValidation,
  },
};

async function getAllUserAccountsById(req: Request<EntityId>, res: Response<UserAccount>, next: NextFunction) {
  try{
    const userAccount = await userAccountService.getUserAccountById(req.params.id, req.userId);
    res.send(userAccount);
  } catch(error){
    next(error);
  }
}

getAllUserAccountsById.validationSchema = {
  params: {
    id: objectIdValidation,
  },
};

async function updateUserAccount(
  req: Request<EntityId, {}, UpdateUserAccountInput>, res: Response<UserAccount>, next: NextFunction,
){
  try{
    const userAccount = await userAccountService.updateUserAccount(
      req.params.id, req.body,
    );
    res.send(userAccount);
  } catch(error){
    next(error);
  }

}

updateUserAccount.validationSchema = {
  params: {
    id: objectIdValidation,
  },
  body: {
    username: Joi.string(),
    status: Joi.string().valid(AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.BANNED),
  },
};

async function deleteUserAccount(
  req: Request<EntityId, {}, UpdateUserAccountInput>, res: Response<UserAccount>, next: NextFunction,
) {
  try{
    await userAccountService.deleteUserAccount(req.params.id);
    res.status(201).send();
  } catch (error){
    next(error);
  }
}

deleteUserAccount.validationSchema = {
  params: {
    id: objectIdValidation,
  },
};

export function installUserAccountRoutes(parentRouter: Router) {
  const router = Router();
    
  router.get(
    "/",
    requireAuthentication,
    collectDeviceInfo,
    validate(getAllUserAccounts.validationSchema), 
    getAllUserAccounts,
  );

  router.get(
    "/:id",
    requireAuthentication,
    collectDeviceInfo,
    validate(getAllUserAccountsById.validationSchema),
    getAllUserAccountsById,
  );
    
  router.patch(
    "/:id",
    requireAuthentication,
    collectDeviceInfo,
    validate(updateUserAccount.validationSchema),
    updateUserAccount,

  );

  router.delete(
    "/:id",
    requireAuthentication,
    collectDeviceInfo,
    validate(deleteUserAccount.validationSchema),
    deleteUserAccount,
  );
  
  parentRouter.use("/useraccounts", router);
};

