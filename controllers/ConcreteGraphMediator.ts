import GraphEntity from "../db/GraphEntity";
import GraphModel from "../models/GraphModel";
import { Mediator } from "../interfaces/mediatorInterface";

export class ConcreteGraphMediator implements Mediator {
  async executeGraph(id: number, start: string, goal: string) {
    const graph = new GraphModel();
    await graph.inizializza(id);
    return graph.esegui(start, goal);
  }

  async createGraph(data: object) {
  const entity = await GraphEntity.create({ data });

  const model = new GraphModel();
  await model.inizializza(entity.id);
  await model.calcolaCosto(); 
 const updatedEntity = await GraphEntity.findByPk(entity.id);
if (!updatedEntity) throw new Error("Errore interno: grafo non trovato dopo creazione.");

return {
  id: updatedEntity.id,
  stato: updatedEntity.stato,
  costo: updatedEntity.costo
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

  async getGraphCost(id: number): Promise<number> {
    const graph = new GraphModel();
    await graph.inizializza(id);
    return await graph.calcolaCosto(); 
  }
}

export default ConcreteGraphMediator;
