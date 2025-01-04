import { Request, Response, NextFunction, application } from "express";
import { Router } from "express";
import Joi, { valid } from "joi";
import validate, { objectIdValidation } from "../core/validation";  // You may use this to validate inputs
import * as userAccountService from "../service/userAccount.service";
import { CreateUserAccountInput, GetAllUserAccountsResponse, UpdateUserAccountInput, UserAccount } from "../types/userAccount.types"; // Import types
import { EntityId } from "../types/common.types";
import { requireAuthentication, requirePermission } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";

// Controller function for creating a new user account
async function createUserAccount(
  req: Request<{}, {}, CreateUserAccountInput>, 
  res: Response<UserAccount>, 
  next: NextFunction
) {
  try {
    // Destructure the request body to get the necessary fields
    const { username, password, status, userId, appId } = req.body;

    // Call the service to create a new user account
    const userAccount = await userAccountService.createUserAccount(username, password, status, userId, appId);

    // Respond with the newly created user account
    res.status(201).send(userAccount);
  } catch (error) {
    // Pass any errors to the next middleware (error handler)
    next(error);
  }
}

createUserAccount.validationSchema = {
    body: {
      userId: objectIdValidation,
      appId: objectIdValidation,
      email: Joi.string().email(),
      password: Joi.string(),
      username: Joi.string(),
      status: Joi.string(),
    },
  };

async function getAllUserAccounts(req :Request<EntityId>, res: Response<GetAllUserAccountsResponse>, next: NextFunction) {
    try{
        const userAccount = await userAccountService.getAllUserAccounts(req.userId, req.params.id); 
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




async function getAllUserAccountsById(req: Request<EntityId>, res: Response<UserAccount | null>, next: NextFunction) {
    try{
        const userAccount = await userAccountService.getUserAccountById(req.params.id);
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




async function updateUserAccount( req: Request<EntityId, {}, UpdateUserAccountInput>, res: Response<UserAccount>, next: NextFunction,){
    try{
        const userAccount = await userAccountService.updateUserAccount(req.params.id, {username: req.body.username, status: req.body.status})
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
        status: Joi.string(),
    },
};


async function deleteUserAccount(req: Request<EntityId, {}, UpdateUserAccountInput>, res: Response<UserAccount>, next: NextFunction ) {
    try{
        const userAccount = await userAccountService.deleteUserAccount(req.params.id);
    res.send(userAccount);
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
    
    router.post("/", validate(createUserAccount.validationSchema), createUserAccount);
    router.get(
      "/",
      requireAuthentication,
      collectDeviceInfo,
      validate(getAllUserAccounts.validationSchema), 
      getAllUserAccounts,
    );

    router.get("/:id", validate(getAllUserAccountsById.validationSchema), getAllUserAccountsById);
    router.get(
        "/:id",
        requireAuthentication,
        collectDeviceInfo,
        validate(getAllUserAccountsById.validationSchema),
        getAllUserAccountsById,
      );
    
    router.put("/:id", validate(updateUserAccount.validationSchema), updateUserAccount);
    router.get(
        "/id",
        requireAuthentication,
        collectDeviceInfo,
        validate(updateUserAccount.validationSchema),
        updateUserAccount

    )

    router.get(":/id", validate(deleteUserAccount.validationSchema), deleteUserAccount);
    router.get(
        "/id",
        requireAuthentication,
        collectDeviceInfo,
        validate(deleteUserAccount.validationSchema),
        deleteUserAccount
    )


    
  
    parentRouter.use("/useraccounts", router);
  };


