// states/StateInEsecuzione.ts
import Graph from "node-dijkstra";
import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import Logger from "../utils/Logger";

export default class StateInEsecuzione implements GraphState {
   private logger: typeof Logger;

  constructor(private context: GraphModel, logger: typeof Logger) {
    this.logger = logger;
  }

  getState(): string {
    return "InEsecuzione";
  }

  async execute(start: string, goal: string) {
    const rawGraph = await this.context.getRawGraph();
    const graph = new Graph(rawGraph);

    this.logger.info(`Esecuzione grafo ${this.context.id} da ${start} a ${goal}`);

    // Controllo nodi esistenti
if (!rawGraph[start]) {
  throw new Error(`Il nodo di partenza '${start}' non esiste nel grafo`);
}
if (!rawGraph[goal]) {
  throw new Error(`Il nodo di arrivo '${goal}' non esiste nel grafo`);
}

// Nodo uguale
if (start === goal) {
  this.logger.info(`Start e goal coincidono (${start})`);
  return {
    stato: this.getState(),
    percorso: [start],
    costo: 0,
    tempo: 0
  };
}

    const startTime = Date.now();
    const result = graph.path(start, goal, { cost: true });
    const endTime = Date.now();

    if (!result) {
      this.logger.error(`Percorso non trovato da ${start} a ${goal}`);
      throw new Error("Percorso non trovato");
    }

    const tempo = (endTime - startTime) / 1000;

    // node-dijkstra restituisce sempre un oggetto { path, cost } quando cost: true
    if (!("path" in result) || !("cost" in result)) {
      throw new Error("Il risultato del percorso è malformato");
    }

    const { path, cost } = result;

    this.logger.info(
      `Percorso calcolato in ${tempo}s: ${path.join(" -> ")} (costo: ${cost})`
    );

    return {
      stato: this.getState(),
      percorso: path,
      costo: cost,
      tempo
    };
  }

  async updateWeight(): Promise<void> {
    throw new Error("Non puoi modificare un grafo in esecuzione.");
  }

  async simulate(): Promise<void> {
    throw new Error("Non puoi simulare un grafo in esecuzione.");
  }
}
