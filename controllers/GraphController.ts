import { Router, Request, Response } from "express";
import BaseController from "./BaseController";
import { Mediator } from "../interfaces/mediatorInterface";
import validateGraphMiddleware from "../validations/validateGraph";
import validateSimulationMiddleware from "../validations/validateSimulation";
import { StatusCodes } from "http-status-codes";

class GraphController extends BaseController {
  public router: Router;
  protected mediator: Mediator; 


  constructor(mediator: Mediator) {
    super();
    this.mediator = mediator; 
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/graphs/execute", this.executeGraph);
    this.router.post("/graphs/create", validateGraphMiddleware, this.createGraph.bind(this));
    this.router.get("/graphs", this.getGraphs);
    this.router.post("/update-weight", this.updateWeightHandler.bind(this)); 
    this.router.post("/graphs/simulate", validateSimulationMiddleware, this.simulateGraph.bind(this));
  }
  private getGraphs = async (req: Request, res: Response) => {
  try {
    const result = await this.mediator.getAllGraphs();
    res.status(200).json(result);
  } catch (error) {
    console.error("Errore nel recupero dei grafi:", error);
    res.status(500).json({ error: "Errore nel recupero dei grafi." });
  }
};

  private createGraph = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await this.mediator.createGraph(data);
  res.status(201).json(result);
};


  private executeGraph = async (req: Request, res: Response) => {
    const { id, start, goal } = req.body;
    const result = await this.mediator.executeGraph(id, start, goal);
    res.status(200).json(result);
  };
private async updateWeightHandler(req: Request, res: Response) {
  const { id, from, to, newWeight } = req.body;
  try {
    const result = await this.mediator.updateWeight(id, from, to, newWeight);
    res.status(200).json(result);
  } catch (error: any) {
  console.error("Errore aggiornamento peso:", error.message || error);
  res.status(500).json({ error: "Errore aggiornamento peso", details: error.message || error });

  }
}
private async simulateGraph(req: Request, res: Response) {
  try {
    const { id, from, to, wStart, wEnd, step } = req.body;
    const result = await this.mediator.simulateGraph(id, from, to, wStart, wEnd, step);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    console.error("Errore simulazione:", error.message || error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message || error });
  }
}


}

export default GraphController;
