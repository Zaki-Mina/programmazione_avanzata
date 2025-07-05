import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";
import GraphEntity from "../db/GraphEntity";
import { getAlpha } from "../utils/alpha"; 

class StateModificato implements GraphState {
  constructor(private context: GraphModel) {}

  getState(): string {
    return "Modificato";
  }



  async updateWeight(from: string, to: string, newWeight: number): Promise<number> {
    const rawGraph = await this.context.getRawGraph();

    if (!(from in rawGraph)) {
      throw new Error(`Nodo "${from}" non trovato`);
    }
    if (!(to in rawGraph[from])) {
      throw new Error(`Arco da "${from}" a "${to}" non trovato`);
    }

    const previousWeight = parseFloat(rawGraph[from][to] as any); // per forziare il tipo
    const alpha = getAlpha();
    const updatedWeight = alpha * previousWeight + (1 - alpha) * newWeight;

    rawGraph[from][to] = updatedWeight;

    await GraphEntity.update(
      { data: rawGraph, stato: "Modificato" },
      { where: { id: this.context.id } }
    );

    console.log(`
=== DEBUG PESO MODIFICATO ===
  from: ${from}
  to: ${to}
  Peso precedente: ${previousWeight}
  Peso nuovo suggerito: ${newWeight}
  Alpha: ${alpha}
  Nuovo peso calcolato: ${updatedWeight}
==============================
`);

    return updatedWeight; // per restituire il peso aggiornato
  }


  async simulate() {
    throw new Error("Non puoi simulare  un grafo appena creato.");
  }
  async execute() {
    throw new Error("Non puoi eseguire un grafo appena creato.");
  }
}

export default StateModificato;
