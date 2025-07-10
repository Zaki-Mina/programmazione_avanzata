// states/StateSimulazione.ts
import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import GraphEntity from "../db/GraphEntity";
import Logger from "../utils/Logger";

class StateSimulazione implements GraphState {
  private logger: typeof Logger;

  constructor(private context: GraphModel, logger: typeof Logger) {
    this.logger = logger;
  }

  getState(): string {
    return "Simulazione";
  }

  async execute() {
    throw new Error("Non puoi eseguire un grafo in simulazione.");
  }

  async updateWeight() {
    throw new Error("Non puoi modificare un grafo in simulazione.");
  }

  async simulate(from: string, to: string, startWeight: number, endWeight: number, step: number) {
    const dbGraph = await GraphEntity.findByPk(this.context.id);
    if (!dbGraph) {
      this.logger.error(`Grafo ${this.context.id} non trovato`);
      throw new Error("Grafo non trovato");
    }

    const data = dbGraph.data as Record<string, Record<string, number>>;

    if (!data[from] || typeof data[from][to] !== "number") {
      this.logger.error(`Arco da ${from} a ${to} non trovato`);
      throw new Error(`Arco da ${from} a ${to} non trovato`);
    }

    const originalWeight = data[from][to];
    const results: Array<{ peso: number; costo: number }> = [];

    this.logger.info(`Simulazione peso su arco ${from} → ${to}, range: ${startWeight} → ${endWeight}, step: ${step}`);

    for (let w = startWeight; w <= endWeight; w += step) {
      data[from][to] = w;

      const nodi = Object.keys(data).length;
      const archi = Object.values(data).reduce((acc, edges) => acc + Object.keys(edges).length, 0);

      const costo = 0.20 * nodi + 0.01 * archi;
      results.push({ peso: w, costo });
    }

    data[from][to] = originalWeight;

    this.logger.info(`Simulazione completata su ${results.length} varianti`);
    return results;
  }
}

export default StateSimulazione;
