import { Employee } from "@prisma/client";
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
import * as employeeService from "../service/employee.service";
import { EntityId, ListResponse } from "../types/common.types";
import { CreateEmployeeInput, EmployeeFilters, UpdateEmployeeInput } from "../types/employee.types";

async function createEmployee(req: Request<{}, {}, CreateEmployeeInput>, res: Response<Employee>, next: NextFunction) {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).send(employee);
  } catch (error) {
    next(error);
  }
}
createEmployee.validationSchema = {
  body: {
    role: Joi.string(),
    email: Joi.string().email().required(),
    companyId: objectIdValidation,
    status: Joi.string().default("pending"),
  },
};

async function getAllEmployees(
  req: Request<{}, {}, {}, EmployeeFilters>,
  res: Response<ListResponse<Employee>>,
  next: NextFunction
) {
  try {
    const employees = await employeeService.getAllEmployees(req.userId, req.query);
    res.send({ items: employees });
  } catch (error) {
    next(error);
  }
}
getAllEmployees.validationSchema = {
  query: {
    companyId: objectIdValidation.optional(),
    role: Joi.string().optional(),
    email: Joi.string().optional(),
    ...paginationParamsValidation,
    ...dateFilterParamsValidation,
    ...sortingParamsValidation,
  },
};

async function getEmployeeById(req: Request<EntityId>, res: Response<Employee>, next: NextFunction) {
  try {
    const employees = await employeeService.getEmployeeById(req.userId, req.params.id);
    res.send(employees);
  } catch (error) {
    next(error);
  }
}
getEmployeeById.validationSchema = { params: { id: objectIdValidation } };

async function updateEmployee(
  req: Request<EntityId, {}, UpdateEmployeeInput>,
  res: Response<Employee>,
  next: NextFunction
) {
  try {
    const employee = await employeeService.updateEmployee(req.userId, req.params.id, req.body);
    res.send(employee);
  } catch (error) {
    next(error);
  }
}
updateEmployee.validationSchema = {
  params: { id: objectIdValidation },
  body: { role: Joi.string(), status: Joi.string() },
};

async function deleteEmployee(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try {
    await employeeService.deleteEmployee(req.userId, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

deleteEmployee.validationSchema = { params: { id: objectIdValidation } };
export function installEmployeeRoutes(parentRouter: Router) {
  const router = Router();

  router.post("/", requireAuthentication, validate(createEmployee.validationSchema), createEmployee);
  router.get("/", requireAuthentication, validate(getAllEmployees.validationSchema), getAllEmployees);
  router.get("/", requireAuthentication, validate(getEmployeeById.validationSchema), getEmployeeById);
  router.get("/", requireAuthentication, validate(updateEmployee.validationSchema), updateEmployee);
  router.delete("/:id", requireAuthentication, validate(deleteEmployee.validationSchema), deleteEmployee);

  parentRouter.use("/employees", router);
}
