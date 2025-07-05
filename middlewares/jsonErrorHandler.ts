import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

// Middleware globale per intercettare JSON malformati in entrata
const jsonErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Formato JSON non valido.",
      dettagli: err.message
    });
  } else {
    next(err);
  }
};

export default jsonErrorHandler;
