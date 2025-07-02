import Graph from "node-dijkstra";
import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import GraphEntity from "../db/GraphEntity";

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


async updateWeight(from: string, to: string, newWeight: number): Promise<void> {
  const dbGraph = await GraphEntity.findByPk(this.context.id);
  if (!dbGraph) throw new Error("❌ Grafo non trovato nel DB");

  const data = dbGraph.data as Record<string, Record<string, number>>;

  // Verifica che i nodi esistano
  if (!data[from] || typeof data[from][to] !== "number") {
    throw new Error(`❌ Arco da ${from} a ${to} non trovato nel grafo`);
  }

  // ✅ Modifica il peso
  data[from][to] = newWeight;

  // 🔄 Salva la modifica nel DB
  dbGraph.data = data;
  dbGraph.stato = "Modificato"; // Passa allo stato "Modificato"
  await dbGraph.save();

  console.log(`✅ Peso aggiornato: ${from} -> ${to} = ${newWeight}`);
}

  simulate(from: string, to: string, startWeight: number, endWeight: number, step: number) {
    throw new Error("⚠️ Non puoi simulare archi in stato 'Creato'");
  }
}

export default StateCreato;
