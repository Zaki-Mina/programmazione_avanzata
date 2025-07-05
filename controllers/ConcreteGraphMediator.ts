import GraphEntity from "../db/GraphEntity";
import GraphModel from "../models/GraphModel";
import { Mediator } from "../interfaces/mediatorInterface";

export class ConcreteGraphMediator implements Mediator {
  async executeGraph(id: number, start: string, goal: string) {
    const graph = new GraphModel();
    await graph.inizializza(id);
    return graph.esegui(start, goal);
  }

 async createGraph(data: { nome: string, struttura: object }) {
  const existing = await GraphEntity.findOne({ where: { nome: data.nome } });
  if (existing) throw new Error("Grafo con lo stesso nome già esistente");

  const entity = await GraphEntity.create({ nome: data.nome, data: data.struttura });
  const model = new GraphModel();
  await model.inizializza(entity.id);
  await model.calcolaCosto();
  
  const updated = await GraphEntity.findByPk(entity.id);
  if (!updated) throw new Error("Errore interno: grafo non trovato dopo creazione");

  return { id: updated.id, stato: updated.stato, costo: updated.costo };
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

  async getGraphCost(id: number): Promise<number> {
    const graph = new GraphModel();
    await graph.inizializza(id);
    return await graph.calcolaCosto(); 
  }
  async simulateGraph(id: number, from: string, to: string, wStart: number, wEnd: number, step: number) {
  const graph = new GraphModel();
  await graph.inizializza(id);
  return graph.simula(from, to, wStart, wEnd, step);
}

}

export default ConcreteGraphMediator;
