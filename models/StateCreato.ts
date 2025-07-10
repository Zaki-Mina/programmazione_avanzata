import GraphEntity from "../db/GraphEntity";
import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import Logger from "../utils/Logger";

export default class StateCreato implements GraphState {
  private context: GraphModel;
  private logger: typeof Logger;

  constructor(context: GraphModel, logger:typeof Logger) {
    this.context = context;
    this.logger = logger;
  }

  getState(): string {
    return "Creato";
  }

  async calcolaCosto(): Promise<number> {
    const dbGraph = await GraphEntity.findByPk(this.context.id);
    if (!dbGraph) throw new Error("Grafo non trovato");

    const data = dbGraph.data as Record<string, Record<string, number>>;
    const nodi = Object.keys(data).length;
    const archi = Object.values(data).reduce(
      (acc, edges) => acc + Object.keys(edges).length,
      0
    );

    const costo = 0.2 * nodi + 0.01 * archi;
    dbGraph.costo = costo;
    await dbGraph.save();

    this.logger.info(`Costo calcolato per il grafo ${this.context.id}: ${costo}`);
    return costo;
  }

  async execute(start: string, goal: string): Promise<any> {
    throw new Error("Esecuzione non consentita nello stato Creato.");
  }

  async updateWeight(from: string, to: string, newWeight: number): Promise<number> {
    throw new Error("Modifica non consentita nello stato Creato.");
  }
  simulate(): void {
  this.logger.log("Simulazione non disponibile nello stato Creato.");
}

}
