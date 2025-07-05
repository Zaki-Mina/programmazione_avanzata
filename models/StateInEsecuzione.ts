
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
    const startTime = Date.now();
    const result = graph.path(start, goal, { cost: true });
    const endTime = Date.now();

    if (!result) throw new Error("Percorso non trovato");
    const tempo = (endTime - startTime) / 1000;

    if (Array.isArray(result)) {
      return {
        stato: this.getState(),
        percorso: result,
        costo: null,
        tempo
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
