import GraphEntity from "../db/GraphEntity";
import { GraphState } from "../interfaces/graphState";
import StateCreato from "./StateCreato";
import StateModificato from "./StateModificato";
import StateInEsecuzione from "./StateInEsecuzione";

export default class GraphModel {
  
 async calcolaCosto(): Promise<number> {
  if (typeof this.state.calcolaCosto !== "function") {
    throw new Error(`Calcolo costo non supportato nello stato: ${this.getStato()}`);
  }
  return await this.state.calcolaCosto();
}

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
    case "Modificato":
      this.state = new StateModificato(this);
      break;
    case "InEsecuzione":
      this.state = new StateInEsecuzione(this);
      break;
    default:
      throw new Error("Stato non gestito: " + nuovoStato);
  }
}

  // Inizializza lo stato attuale ( recuperare lo stato reale dal database)
  async inizializza(id: number) {
  this.id = id;

  const entity = await GraphEntity.findByPk(id);
  if (!entity) throw new Error("Grafo non trovato");

  const statoCorrente = entity.stato;
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
  if (this.getStato() !== "InEsecuzione") {
    this.transizione("InEsecuzione");
    await GraphEntity.update(
      { stato: "InEsecuzione" },
      { where: { id: this.id } }
    );
  }
  return await this.state.execute(start, goal);
}



  // Azione: aggiornare un peso tra due nodi
async updateWeight(from: string, to: string, newWeight: number): Promise<number> {
  const statoAttuale = this.getStato();

  if (statoAttuale === "InEsecuzione") {
    throw new Error("Non puoi modificare un grafo in esecuzione.");
  }

  if (statoAttuale !== "Modificato") {
    this.transizione("Modificato");
  }

  return await this.state.updateWeight(from, to, newWeight);
}


  // Azione: simulare variazioni di peso
  async simulateWeight(from: string, to: string, wStart: number, wEnd: number, step: number) {
    return await this.state.simulate(from, to, wStart, wEnd, step);
  }
}
