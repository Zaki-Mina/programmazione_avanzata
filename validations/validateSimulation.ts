// validations/validateSimulation.ts
import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import simulationSchema from "./simulationSchema";

const ajv = new Ajv();
const validate = ajv.compile(simulationSchema);

const validateSimulationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const valid = validate(req.body);
  if (!valid) {
    res.status(400).json({
      error: "Struttura della simulazione non valida",
      dettagli: validate.errors,
    });
    return;
  }
  next(); // Se tutto va bene, continua
};

export default validateSimulationMiddleware;
