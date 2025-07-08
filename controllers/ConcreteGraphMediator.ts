import GraphEntity from "../db/GraphEntity";
import GraphModel from "../models/GraphModel";
import { Mediator } from "../interfaces/mediatorInterface";

import User from "../models/User";

//Implementazione concreta dell'interfaccia Mediator
export class ConcreteGraphMediator implements Mediator {

  //esegue un algoritmo su un grafo
  async executeGraph(id: number, start: string, goal: string) {
    const graph = new GraphModel();
    await graph.inizializza(id);
    return graph.esegui(start, goal);
  }

  //crea un nuovo grafo
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


//recupera tutti i grafi
  async getAllGraphs() {
    const graph = new GraphModel();
    return graph.getAll();
  }

  //aggiorna il peso di un arco
  async updateWeight(id: number, from: string, to: string, newWeight: number): Promise<void> {
    const graph = new GraphModel();
    await graph.inizializza(id);
    await graph.updateWeight(from, to, newWeight);
  }
//cambia lo stato di un grafo
  async setState(id: number, state: string): Promise<void> {
    const graph = await GraphEntity.findByPk(id);
    if (!graph) throw new Error("Grafo non trovato");
    graph.stato = state;
    await graph.save();
  }

 //calcola il costo di un grafo
  async getGraphCost(id: number): Promise<number> {
    const graph = new GraphModel();
    await graph.inizializza(id);
    return await graph.calcolaCosto(); 
  }
  //simula variazioni di peso
  async simulateGraph(id: number, from: string, to: string, wStart: number, wEnd: number, step: number) {
  const graph = new GraphModel();
  await graph.inizializza(id);
  return graph.simula(from, to, wStart, wEnd, step);
}
//ricarica i token di un utente (solo admin)
 async rechargeUserTokens(email: string, tokens: number) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const err = new Error("Utente non trovato");
      // @ts-ignore
      err.statusCode = 404;
      throw err;
    }
    user.tokens = tokens;
    await user.save();
    return user;
  }
}
export default ConcreteGraphMediator;