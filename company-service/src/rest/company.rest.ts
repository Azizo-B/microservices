import { Company } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication } from "../core/auth";
import validate, { objectIdValidation, paginationParamsValidation } from "../core/validation";
import * as companyService from "../service/company.service";
import * as employeeService from "../service/employee.service";
import { EntityId, ListResponse, PaginationParams } from "../types/common.types";
import { CreateCompanyRequest, UpdateCompanyInput } from "../types/company.types";

async function createCompany(req: Request<{}, {}, CreateCompanyRequest>, res: Response<Company>, next: NextFunction) {
  try {
    const company = await companyService.createCompany(req.body.company);
    await employeeService.createEmployee(
      { companyId: company.id, email: req.body.email, role: "admin", status: "added" },
      req.userId
    );
    res.status(201).send(company);
  } catch (error) {
    next(error);
  }
}
createCompany.validationSchema = { body: { company: { name: Joi.string() }, email: Joi.string().email() } };

async function getAllCompanies(
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<ListResponse<Company>>,
  next: NextFunction
) {
  try {
    const companies = await companyService.getAllCompanies(req.query);
    res.send({ items: companies });
  } catch (error) {
    next(error);
  }
}
getAllCompanies.validationSchema = { query: { ...paginationParamsValidation } };

async function getCompanyById(req: Request<EntityId>, res: Response<Company>, next: NextFunction) {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.send(company);
  } catch (error) {
    next(error);
  }
}
getCompanyById.validationSchema = { params: { id: objectIdValidation } };

async function updateCompany(
  req: Request<EntityId, {}, UpdateCompanyInput>,
  res: Response<Company>,
  next: NextFunction
) {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    res.send(company);
  } catch (error) {
    next(error);
  }
}
updateCompany.validationSchema = {
  params: { id: objectIdValidation },
  body: { name: Joi.string(), domain: Joi.string() },
};

async function deleteCompany(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try {
    await companyService.deleteCompany(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
deleteCompany.validationSchema = { params: { id: objectIdValidation } };

export function installCompanyRoutes(parentRouter: Router) {
  const router = Router();

  router.post("/", requireAuthentication, validate(createCompany.validationSchema), createCompany);
  router.get("/", requireAuthentication, validate(getAllCompanies.validationSchema), getAllCompanies);
  router.get("/:id", requireAuthentication, validate(getCompanyById.validationSchema), getCompanyById);
  router.patch("/:id", requireAuthentication, validate(updateCompany.validationSchema), updateCompany);
  router.delete("/:id", requireAuthentication, validate(deleteCompany.validationSchema), deleteCompany);

  parentRouter.use("/companies", router);
}
