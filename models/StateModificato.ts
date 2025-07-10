import { GraphState } from "../interfaces/graphState";
import GraphModel from "../models/GraphModel";
import GraphEntity from "../db/GraphEntity";
import { getAlpha } from "../utils/alpha";
import Logger from "../utils/Logger";
import { GraphVersionEntity } from "../db/GraphVersionEntity";

export default class StateModificato implements GraphState {
  constructor(
    private context: GraphModel,
    private logger: typeof Logger
  ) {}

  getState(): string {
    return "Modificato";
  }

  async updateWeight(
    from: string,
    to: string,
    newWeight: number
  ): Promise<number> {
    const rawGraph = await this.context.getRawGraph();

    if (!rawGraph[from]) {
      this.logger.error(`Nodo "${from}" non trovato`);
      throw new Error(`Nodo "${from}" non trovato`);
    }
    if (!rawGraph[from][to]) {
      this.logger.error(`Arco da "${from}" a "${to}" non trovato`);
      throw new Error(`Arco da "${from}" a "${to}" non trovato`);
    }

    const previousWeight = Number(rawGraph[from][to]);
    const alpha = getAlpha();
    const updatedWeight = alpha * previousWeight + (1 - alpha) * newWeight;

    rawGraph[from][to] = updatedWeight;

    // Persist updated graph and state
    await GraphEntity.update(
      { data: rawGraph, stato: this.getState() },
      { where: { id: this.context.id } }
    );

    // Calcolo e salvataggio versione
    const nodes = Object.keys(rawGraph).length;
    const edges = Object.values(rawGraph)
      .flatMap(adj => Object.keys(adj)).length;

    await GraphVersionEntity.create({
      graphId: this.context.id,
      struttura: rawGraph,
      nNodes: nodes,
      nEdges: edges,
    });

    this.logger.info(`
  [Modificato] Peso aggiornato da ${previousWeight} a ${updatedWeight}
  Alpha: ${alpha}
    `);

    return updatedWeight;
  }

  async execute(): Promise<void> {
    throw new Error("Non puoi eseguire un grafo appena modificato.");
  }

  async simulate(): Promise<void> {
    throw new Error("Non puoi simulare un grafo appena modificato.");
  }
}
