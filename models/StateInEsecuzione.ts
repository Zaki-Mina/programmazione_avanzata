
import Graph from "node-dijkstra";
import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import GraphEntity from "../db/GraphEntity";

class StateInEsecuzione implements GraphState {
  constructor(private context: GraphModel) {}

  getState(): string {
    return "InEsecuzione";
  }

async execute(start: string, goal: string) {
    const rawGraph = await this.context.getRawGraph();
    const graph = new Graph(rawGraph);
    const result = graph.path(start, goal, { cost: true });

    if (!result) throw new Error("Percorso non trovato");

    if (Array.isArray(result)) {
      return {
        stato: this.getState(),
        percorso: result,
        costo: null,
      };
    }

    return {
      stato: this.getState(),
      percorso: result.path,
      costo: result.cost,
    };
  }

  async updateWeight() {
    throw new Error("Non puoi modificare un grafo in esecuzione.");
  }

  async simulate() {
    throw new Error("Non puoi simulare  un grafo appena creato.");
  }
}

export default StateInEsecuzione;
