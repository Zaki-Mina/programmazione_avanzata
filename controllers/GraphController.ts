// controllers/GraphController.ts
import Logger from "../utils/Logger";
import { Router, Request, Response, NextFunction } from "express";
import BaseController from "./BaseController";
import validateGraphMiddleware from "../validations/validateGraph";
import validateSimulationMiddleware from "../validations/validateSimulation";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/adminMiddleware";
import { hasEnoughCredit } from "../middlewares/checkCredit";
import { ConcreteGraphMediator } from "./ConcreteGraphMediator";
import loggerInstance from "../utils/Logger";
import { AuthedRequest } from "../interfaces/AuthedRequest";
import { validateExecuteMiddleware } from "../middlewares/validateExecuteMiddleware";
import { Op, WhereOptions } from "sequelize";

export default class GraphController extends BaseController {
  public router: Router;
  protected mediator = new ConcreteGraphMediator(loggerInstance);

  constructor() {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void { //configura tutti gli endpoint disponibili
    this.router.post("/graphs", verifyToken, hasEnoughCredit, validateGraphMiddleware, this.createGraph);
    this.router.post("/graphs/execute", verifyToken, hasEnoughCredit,validateExecuteMiddleware, this.executeGraph);
    this.router.post("/update-weight", verifyToken, hasEnoughCredit, this.updateWeightHandler);
    this.router.post("/graphs/simulate", verifyToken, hasEnoughCredit, validateSimulationMiddleware, this.simulateGraph);
    this.router.get("/graphs", verifyToken, this.getGraphs.bind(this));
    this.router.post("/users/admin/recharge", verifyToken, isAdmin, this.rechargeUserTokens);
    this.router.get("/graphs/:id/versions",verifyToken,(req, res, next) => {void this.getGraphVersions(req as AuthedRequest, res, next);});  }

  private getGraphs = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info("GET /graphs");
    try {
      const data = await this.mediator.getAllGraphs();
      res.status(200).json(data);
    } catch (err) { next(err); }
  };

 private createGraph = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  Logger.info("POST /graphs/create");
  try {
    const result = await this.mediator.createGraph(req.body, req.user!);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

private executeGraph = async (req: Request, res: Response, next: NextFunction) => {
  Logger.info("POST /graphs/execute");
  try {
    const { id, start, goal } = req.body;
    res.status(200).json(await this.mediator.executeGraph(id, start, goal));
  } catch (err) {
    next(err);
  }
};


  private updateWeightHandler = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info("POST /update-weight");
    try {
      const { id, from, to, newWeight } = req.body;
      await this.mediator.updateWeight(id, from, to, newWeight);
      res.status(200).json({ message: "Peso aggiornato correttamente" });
    } catch (err) { next(err); }
  };

  private simulateGraph = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info("POST /graphs/simulate");
    try {
      const { id, from, to, wStart, wEnd, step } = req.body;
      res.status(StatusCodes.OK).json(await this.mediator.simulateGraph(id, from, to, wStart, wEnd, step));
    } catch (err) { next(err); }
  };

 private rechargeUserTokens = async (req: Request, res: Response, next: NextFunction) => { 
  Logger.info("POST /users/admin/recharge");

  try {
    const { email, tokens } = req.body;

    const user = await this.mediator.rechargeUserTokens(email, tokens);

    res.status(200).json({ message: `Credito aggiornato a ${user.tokens}` });

  } catch (err: any) {
    if (err.message === "Utente non trovato" || err.message.includes("credito negativo")) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
};
private getGraphVersions = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const graphId = Number(req.params.id);
  if (isNaN(graphId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID grafo non valido" });
  }

  const { updatedAt, nNodes, nEdges } = req.query;

  const nNodesNum = nNodes ? Number(nNodes) : undefined;
  const nEdgesNum = nEdges ? Number(nEdges) : undefined;

  const filters: WhereOptions = {};

  if (typeof updatedAt === "string") {
    const date = new Date(updatedAt);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    filters.updatedAt = {
      [Op.gte]: date,
      [Op.lt]: nextDay,
    };
  }

  if (typeof nNodesNum === "number" && !isNaN(nNodesNum)) filters.nNodes = nNodesNum;
  if (typeof nEdgesNum === "number" && !isNaN(nEdgesNum)) filters.nEdges = nEdgesNum;

  try {
    const versions = await this.mediator.getGraphVersions(graphId, filters);
    res.status(StatusCodes.OK).json(versions);
  } catch (err) {
    next(err);
  }
};
}
