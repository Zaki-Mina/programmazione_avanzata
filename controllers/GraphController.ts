//da sistemare alcune cose
import { Router, Request, Response } from "express";
import BaseController from "./BaseController";

class GraphController extends BaseController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/graphs/execute", this.executeGraph);
    this.router.post("/graphs/create", this.createGraph);
    this.router.get("/graphs", this.getGraphs); 
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
}

export default GraphController;
