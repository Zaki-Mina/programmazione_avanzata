import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import { executeSchema } from "./executeSchema";

const ajv = new Ajv();
const validate = ajv.compile(executeSchema);

export function validateExecuteMiddleware(req: Request, res: Response, next: NextFunction): void {
  const valid = validate(req.body);
  if (!valid) {
    res.status(400).json({
      error: "Input non valido",
      details: validate.errors
    });
    return;
  }

  return next(); 
}
