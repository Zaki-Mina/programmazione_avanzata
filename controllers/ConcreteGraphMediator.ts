//da sistemare alcune cose
import GraphEntity from "../db/GraphEntity";
import GraphModel from "../models/GraphModel";
import { Mediator } from "../interfaces/mediatorInterface";


export class ConcreteGraphMediator implements Mediator  {
  async executeGraph(id: number, start: string, goal: string) {
    const graph = new GraphModel();
    await graph.inizializza(id);
    return graph.esegui(start, goal);
  }
  async createGraph(data: object) {
  const graph = await GraphEntity.create({ data });
  return {
    id: graph.id,
    stato: graph.stato
  };
}

async getAllGraphs() {
  const graph = new GraphModel();
  return graph.getAll();
}
async updateWeight(id: number, from: string, to: string, newWeight: number): Promise<void> {
  const graph = new GraphModel();
  await graph.inizializza(id);
  await graph.updateWeight(from, to, newWeight);
}

async setState(id: number, state: string): Promise<void> {
  const graph = await GraphEntity.findByPk(id);
  if (!graph) throw new Error("Grafo non trovato");
  graph.stato = state;
  await graph.save();
}



}

export default ConcreteGraphMediator;
