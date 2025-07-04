import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import graphSchema from "./graphSchema";

const ajv = new Ajv();
const validate = ajv.compile(graphSchema);

const validateGraphMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const valid = validate(req.body);
  if (!valid) {
    res.status(400).json({
      error: "Struttura del grafo non valida",
      dettagli: validate.errors
    });
    return; // Fermati dopo aver mandato la risposta
  }

  next(); // Prosegui se tutto è valido
};

export default validateGraphMiddleware;
