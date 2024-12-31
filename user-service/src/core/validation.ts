import { NextFunction, Request, Response } from "express";
import type { Schema, SchemaLike } from "joi";
import Joi from "joi";

const JOI_OPTIONS: Joi.ValidationOptions = {
  abortEarly: true, // stop when first error occured
  allowUnknown: false, // disallow unknown fields
  convert: true, // convert values to their types (number, Date, ...)
  presence: "required", // default require all fields
};

type RequestValidationSchemeInput = Partial<Record<"params" | "body" | "query", SchemaLike>>;
type RequestValidationScheme = Record<"params" | "body" | "query", Schema>;

const cleanupJoiError = (error: Joi.ValidationError) => {
  const errorDetails = error.details.reduce(
    (resultObj, { message, path, type }) => {
      const joinedPath = path.join(".") || "value";
      if (!resultObj.has(joinedPath)) {
        resultObj.set(joinedPath, []);
      }

      resultObj.get(joinedPath).push({
        type,
        message,
      });

      return resultObj;
    },
    new Map(),
  );

  return Object.fromEntries(errorDetails);
};

const validate = (scheme: RequestValidationSchemeInput | null) => {
  const parsedSchema: RequestValidationScheme = {
    body: Joi.object(scheme?.body || {}),
    params: Joi.object(scheme?.params || {}),
    query: Joi.object(scheme?.query || {}),
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const errors = new Map();

    const { error: paramsErrors, value: paramsValue } = parsedSchema.params.validate(req.params, JOI_OPTIONS);
    if (paramsErrors) {
      errors.set("params", cleanupJoiError(paramsErrors));
    } else {
      req.params = paramsValue;
    }
    
    const { error: bodyErrors, value: bodyValue } = parsedSchema.body.validate(req.body, JOI_OPTIONS);
    if (bodyErrors) {
      errors.set("body", cleanupJoiError(bodyErrors));
    } else {
      req.body = bodyValue;
    }
    const { error: queryErrors, value: queryValue } = parsedSchema.query.validate(req.query, JOI_OPTIONS);
    if (queryErrors) {
      errors.set("query", cleanupJoiError(queryErrors));
    } else {
      req.query = queryValue;
    }

    if (errors.size > 0) {
      res.status(400).json({
        code: "VALIDATION_FAILED",
        message: "Validation failed, check details for more information",
        details: Object.fromEntries(errors),
      });
      return;
    }

    return next();
  };
};

export default validate;

export const objectIdValidation = Joi.string().hex().length(24);