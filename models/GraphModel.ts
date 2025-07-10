import GraphEntity from "../db/GraphEntity";
import { GraphState } from "../interfaces/graphState";
import StateCreato from "./StateCreato";
import StateModificato from "./StateModificato";
import StateInEsecuzione from "./StateInEsecuzione";
import StateSimulazione from "./StateSimulazione";
import logger from "../utils/Logger";

export default class GraphModel {
  public id!: number;
  private state!: GraphState;
  private logger = logger;
  
  constructor() {
    this.state = new StateCreato(this, this.logger); // Stato iniziale fittizio, sovrascritto da inizializza
  }

  async inizializza(id: number) {
    this.id = id;

    const entity = await GraphEntity.findByPk(id);
    if (!entity) throw new Error("Grafo non trovato");

    const statoCorrente = entity.stato;
    this.transizione(statoCorrente);
  }

  transizione(nuovoStato: string): void {
    this.logger.info(`Transizione a nuovo stato: ${nuovoStato}`);

    switch (nuovoStato) {
      case "Creato":
        this.state = new StateCreato(this, this.logger);
        break;
      case "Modificato":
        this.state = new StateModificato(this, this.logger);
        break;
      case "InEsecuzione":
        this.state = new StateInEsecuzione(this, this.logger);
        break;
      case "Simulazione":
        this.state = new StateSimulazione(this, this.logger);
        break;
      default:
        throw new Error("Stato non gestito: " + nuovoStato);
    }
  }

  getStato() {
    return this.state.getState();
  }

  async getRawGraph(): Promise<Record<string, Record<string, number>>> {
    const graph = await GraphEntity.findByPk(this.id);
    if (!graph) {
      throw new Error("Grafo non trovato nel DB");
    }

    return graph.data as Record<string, Record<string, number>>;
  }

  async getAll() {
    const graphs = await GraphEntity.findAll();
    return graphs.map((g) => g.toJSON());
  }

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

  async simula(from: string, to: string, wStart: number, wEnd: number, step: number) {
    if (this.getStato() !== "Simulazione") {
      this.transizione("Simulazione");
      await GraphEntity.update(
        { stato: "Simulazione" },
        { where: { id: this.id } }
      );
    }

    const rawGraph = await this.getRawGraph();
    const Graph = require('node-dijkstra');

    const results: { peso: number, percorso: string[], costo: number }[] = [];
    let bestResult: { peso: number, percorso: string[], costo: number } | null = null;

    for (let w = wStart; w <= wEnd; w += step) {
      const tempGraph = JSON.parse(JSON.stringify(rawGraph)); // deep copy

      if (tempGraph[from] && tempGraph[from][to] !== undefined) {
        tempGraph[from][to] = w;
      } else {
        continue;
      }

      const g = new Graph(tempGraph);
      const result = g.path(from, to, { cost: true });

      if (result) {
        const record = {
          peso: parseFloat(w.toFixed(2)),
          percorso: result.path,
          costo: result.cost
        };

        results.push(record);

        if (!bestResult || record.costo < bestResult.costo) {
          bestResult = record;
        }
      }
    }

    return {
      results,
      best: bestResult
    };
  }

  async calcolaCosto(): Promise<number> {
    if (typeof this.state.calcolaCosto !== "function") {
      throw new Error(`Calcolo costo non supportato nello stato: ${this.getStato()}`);
    }
    return await this.state.calcolaCosto();
  }
  
}
