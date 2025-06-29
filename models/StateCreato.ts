import Graph from "node-dijkstra";
import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";

class StateCreato implements GraphState {
  constructor(private context: GraphModel) {}

  getState(): string {
    return "Creato";
  }


async execute(start: string, goal: string) {
  console.log(`🧠 Eseguo algoritmo da ${start} a ${goal}`);

  const rawGraph = await this.context.getRawGraph(); // dal DB
  const graph = new Graph(rawGraph);

const result = graph.path(start, goal, { cost: true });

if (!result) throw new Error("❌ Percorso non trovato");

// Verifica se il risultato è nel formato { path, cost }
if (Array.isArray(result)) {
  // È solo un array di nodi → nessun costo disponibile
  return {
    stato: this.getState(),
    percorso: result,
    costo: null
  };
} else {
  // È un oggetto { path, cost }
  const { path, cost } = result;

  return {
    stato: this.getState(),
    percorso: path,
    costo: cost
  };
}
}


  updateWeight(from: string, to: string, newWeight: number) {
    throw new Error("⚠️ Non puoi aggiornare pesi in stato 'Creato'");
  }

  simulate(from: string, to: string, startWeight: number, endWeight: number, step: number) {
    throw new Error("⚠️ Non puoi simulare archi in stato 'Creato'");
  }
}

export default StateCreato;
