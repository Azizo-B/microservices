import { Client } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication } from "../core/auth";
import validate, {
  dateFilterParamsValidation,
  objectIdValidation,
  paginationParamsValidation,
  sortingParamsValidation,
} from "../core/validation";
import * as clientService from "../service/client.service";
import { ClientFilters, CreateClientInput, UpdateClientInput } from "../types/client.types";
import { EntityId, ListResponse } from "../types/common.types";

async function createClient(req: Request<{}, {}, CreateClientInput>, res: Response<Client>, next: NextFunction) {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).send(client);
  } catch (error) {
    next(error);
  }
}
createClient.validationSchema = { body: { name: Joi.string().required(), companyId: objectIdValidation } };

async function getAllClients(
  req: Request<{}, {}, {}, ClientFilters>,
  res: Response<ListResponse<Client>>,
  next: NextFunction
) {
  try {
    const clients = await clientService.getAllClients(req.query);
    res.send({ items: clients });
  } catch (error) {
    next(error);
  }
}
getAllClients.validationSchema = {
  query: {
    companyId: objectIdValidation.optional(),
    name: Joi.string().optional(),
    ...paginationParamsValidation,
    ...dateFilterParamsValidation,
    ...sortingParamsValidation,
  },
};

async function getClientById(req: Request<EntityId>, res: Response<Client>, next: NextFunction) {
  try {
    const clients = await clientService.getClientById(req.params.id);
    res.send(clients);
  } catch (error) {
    next(error);
  }
}
getClientById.validationSchema = { params: { id: objectIdValidation } };

async function updateClient(req: Request<EntityId, {}, UpdateClientInput>, res: Response<Client>, next: NextFunction) {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.send(client);
  } catch (error) {
    next(error);
  }
}
updateClient.validationSchema = {
  params: { id: objectIdValidation },
  body: { name: Joi.string(), type: Joi.string(), contact: Joi.string() },
};

async function deleteClient(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try {
    await clientService.deleteClient(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
deleteClient.validationSchema = { params: { id: objectIdValidation } };

export function installClientRoutes(parentRouter: Router) {
  const router = Router();

  router.post("/", requireAuthentication, validate(createClient.validationSchema), createClient);
  router.get("/", requireAuthentication, validate(getAllClients.validationSchema), getAllClients);
  router.get("/:id", requireAuthentication, validate(getClientById.validationSchema), getClientById);
  router.patch("/:id", requireAuthentication, validate(updateClient.validationSchema), updateClient);
  router.delete("/:id", requireAuthentication, validate(deleteClient.validationSchema), deleteClient);

  parentRouter.use("/clients", router);
}
