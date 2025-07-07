import { Router, Request, Response, NextFunction } from "express";
import BaseController from "./BaseController";
import { Mediator } from "../interfaces/mediatorInterface";
import validateGraphMiddleware from "../validations/validateGraph";
import validateSimulationMiddleware from "../validations/validateSimulation";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/adminMiddleware";
import { hasEnoughCredit } from "../middlewares/checkCredit";

export default class GraphController extends BaseController {
  public router: Router;
  protected mediator: Mediator;

  constructor(mediator: Mediator) {
    super();
    this.mediator = mediator;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/graphs/create",
      verifyToken,
      hasEnoughCredit,
      validateGraphMiddleware,
      this.createGraph
    );

    this.router.post(
      "/graphs/execute",
      verifyToken,
      hasEnoughCredit,
      this.executeGraph
    );

    this.router.post(
      "/update-weight",
      verifyToken,
      hasEnoughCredit,
      this.updateWeightHandler
    );

    this.router.post(
      "/graphs/simulate",
      verifyToken,
      hasEnoughCredit,
      validateSimulationMiddleware,
      this.simulateGraph
    );

    this.router.get("/graphs", this.getGraphs);

    // recharge (solo admin)
    this.router.post(
      "/users/admin/recharge",
      verifyToken,
      isAdmin,
      this.rechargeUserTokens
    );
  }

  private getGraphs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.mediator.getAllGraphs();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  private createGraph = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.mediator.createGraph(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  private executeGraph = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, start, goal } = req.body;
      const result = await this.mediator.executeGraph(id, start, goal);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  private updateWeightHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, from, to, newWeight } = req.body;
      await this.mediator.updateWeight(id, from, to, newWeight);
      res.status(200).json({ message: "Peso aggiornato correttamente" });
    } catch (err) {
      next(err);
    }
  };

  private simulateGraph = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, from, to, wStart, wEnd, step } = req.body;
      const result = await this.mediator.simulateGraph(
        id,
        from,
        to,
        wStart,
        wEnd,
        step
      );
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  };

  private rechargeUserTokens = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, tokens } = req.body;
      const user = await this.mediator.rechargeUserTokens(email, tokens);
      res.status(200).json({ message: `Credito aggiornato a ${user.tokens}` });
    } catch (err: any) {
      next(err);
    }
  };
}
