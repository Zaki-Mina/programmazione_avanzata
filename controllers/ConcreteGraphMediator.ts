//da sistemare alcune cose
import GraphEntity from "../db/GraphEntity";
import Mediator from "../interfaces/mediatorInterface";
import GraphModel from "../models/GraphModel";

class ConcreteGraphMediator implements Mediator {
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

}

export default ConcreteGraphMediator;
