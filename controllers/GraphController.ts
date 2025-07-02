//da sistemare alcune cose
import { Router, Request, Response } from "express";
import BaseController from "./BaseController";
import { Mediator } from "../interfaces/mediatorInterface";


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
    this.router.post("/graphs/create", this.createGraph);
    this.router.get("/graphs", this.getGraphs);
    this.router.post("/update-weight", this.updateWeightHandler.bind(this)); 
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


}

export default GraphController;
