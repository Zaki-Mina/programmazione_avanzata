import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import { StatusCodes } from "http-status-codes";
import { graphSchema } from "./graphSchema";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(graphSchema);

// Middleware per validare il corpo della richiesta in fase di creazione grafo
const validateGraphMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const valid = validate(req.body);

  if (!valid) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Struttura del grafo non valida",
      dettagli: validate.errors
    });
    return;
  }

  next();
};

export default validateGraphMiddleware;
