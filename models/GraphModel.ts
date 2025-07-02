import GraphEntity from "../db/GraphEntity";
import { GraphState } from "../interfaces/graphState";
import StateCreato from "./StateCreato";

export default class GraphModel {
  public id!: number;
  private state!: GraphState;

  constructor() {
    this.state = new StateCreato(this); // Stato iniziale fittizio, sovrascritto da inizializza
  }

  // Transizione tra stati
  transizione(nuovoStato: string): void {
    switch (nuovoStato) {
      case "Creato":
        this.state = new StateCreato(this);
        break;
      // case "Eseguito":
      //   this.state = new StateEseguito(this);
      //   break;
      default:
        throw new Error("Stato non gestito: " + nuovoStato);
    }
  }

  // Inizializza lo stato attuale (simulato, in futuro da DB)
  async inizializza(id: number) {
    this.id = id;

    // Simula lo stato del grafo dal "DB"
    const statoCorrente = "Creato";
    this.transizione(statoCorrente);
  }

async getRawGraph(): Promise<Record<string, Record<string, number>>> {
  const graph = await GraphEntity.findByPk(this.id);
  if (!graph) {
    throw new Error(" Grafo non trovato nel DB");
  }

  return graph.data as Record<string, Record<string, number>>;
};
async getAll() {
  const graphs = await GraphEntity.findAll();
  return graphs.map((g) => g.toJSON());
}


  getStato() {
    return this.state.getState();
  }

  // Azione: eseguire un percorso (es. algoritmo di Dijkstra)
  async esegui(start: string, goal: string) {
    return await this.state.execute(start, goal);
  }

  // Azione: aggiornare un peso tra due nodi
  async updateWeight(from: string, to: string, newWeight: number) {
    return await this.state.updateWeight(from, to, newWeight);
  }

  // Azione: simulare variazioni di peso
  async simulateWeight(from: string, to: string, wStart: number, wEnd: number, step: number) {
    return await this.state.simulate(from, to, wStart, wEnd, step);
  }
}
