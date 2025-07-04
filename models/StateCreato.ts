import Graph from "node-dijkstra";
import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import GraphEntity from "../db/GraphEntity";

class StateCreato implements GraphState {
  constructor(private context: GraphModel) {}

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

  return costo;
}
 async execute() {
    throw new Error("Non puoi eseguire un grafo appena creato.");
  }

 async updateWeight() {
    throw new Error("Non puoi modificare un grafo appena creato.");
  }

async simulate() {
    throw new Error("Non puoi simulare  un grafo appena creato.");
  }
}

export default StateCreato;
