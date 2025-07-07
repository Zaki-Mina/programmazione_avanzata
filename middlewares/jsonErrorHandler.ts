import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 1) JSON malformato
  if (err instanceof SyntaxError && "body" in err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Formato JSON non valido.",
      dettagli: err.message,
    });
    return;
  }

  // 2) Altri errori
  const status = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message ?? "Errore interno del server";
  res.status(status).json({ error: message });
  return;
};

export default jsonErrorHandler;
