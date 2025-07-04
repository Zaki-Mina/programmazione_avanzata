import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import GraphEntity from "../db/GraphEntity";

class StateSimulazione implements GraphState {
  constructor(private context: GraphModel) {}

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
    if (!dbGraph) throw new Error("Grafo non trovato");

    const data = dbGraph.data as Record<string, Record<string, number>>;
    if (!data[from] || typeof data[from][to] !== "number") {
      throw new Error(`Arco da ${from} a ${to} non trovato`);
    }

    const originalWeight = data[from][to];
    const results: Array<{ peso: number; costo: number }> = [];

    for (let w = startWeight; w <= endWeight; w += step) {
      data[from][to] = w;

      const nodi = Object.keys(data).length;
      const archi = Object.values(data).reduce((acc, edges) => acc + Object.keys(edges).length, 0);

      const costo = 0.20 * nodi + 0.01 * archi;
      results.push({ peso: w, costo });
    }

    data[from][to] = originalWeight;
    return results;
  }
}

export default StateSimulazione;
