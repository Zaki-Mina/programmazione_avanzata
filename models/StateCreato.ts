import { GraphState } from "../interfaces/graphState";
import GraphModel from "./GraphModel";

class StateCreato implements GraphState {
  constructor(private context: GraphModel) {}

  getState(): string {
    return "Creato";
  }

  execute(start: string, goal: string) {
    console.log(`🧠 Eseguo algoritmo da ${start} a ${goal}`);
    // qui un dommy ritorno (simula Dijkstra)
    const path = [start, "X", "Y", goal];
    const cost = 7.3;

    // transizione a stato "Eseguito" (lo implementerai dopo)
    // this.context.transizione("Eseguito");

    return {
      stato: this.getState(),
      percorso: path,
      costo: cost
    };
  }

  updateWeight(from: string, to: string, newWeight: number) {
    throw new Error("⚠️ Non puoi aggiornare pesi in stato 'Creato'");
  }

  simulate(from: string, to: string, startWeight: number, endWeight: number, step: number) {
    throw new Error("⚠️ Non puoi simulare archi in stato 'Creato'");
  }
}

export default StateCreato;
