import GraphEntity from "../db/GraphEntity";
import GraphModel from "../models/GraphModel";
import { Mediator } from "../interfaces/mediatorInterface";
import Logger from "../utils/Logger";
import User from "../models/User";
import { AuthUser } from "../interfaces/AuthUser";
import { GraphVersionEntity } from "../db/GraphVersionEntity";
import { Op } from "sequelize";

//Implementazione concreta dell'interfaccia Mediator
export class ConcreteGraphMediator implements Mediator {
  constructor(private logger = Logger) {}

async executeGraph(id: number, start: string, goal: string) {
  this.logger.info(`executeGraph: grafo ${id} da ${start} a ${goal}`);

  // Inizializza il modello e calcola percorso + costo path + tempo
  const graph = new GraphModel();
  await graph.inizializza(id);
  const result = await graph.esegui(start, goal);
  // result: { stato, percorso, costo: costoPath, tempo }

  // Recupera l'entità del grafo per conoscere userId e costo di creazione
  const entity = await GraphEntity.findByPk(id);
  if (!entity) throw new Error("Grafo non trovato");

  const tokenCost = entity.costo;  // <— costo di creazione

  // Recupera l'utente e verifica credito
  const dbUser = await User.findByPk(entity.userId);
  if (!dbUser) throw new Error("Utente non trovato");
  if (dbUser.tokens < tokenCost) {
    throw new Error(`Credito insufficiente. Servono ${tokenCost}, hai ${dbUser.tokens}`);
  }

  // Scala il credito in base al costo di creazione
  dbUser.tokens -= tokenCost;
  await dbUser.save();

  // Ritorna il risultato con costo path e credito rimanente
  return {
    stato: result.stato,
    percorso: result.percorso,
    costoPath: result.costo,
    tempo: result.tempo,
    costoEsecuzione: tokenCost,
    creditoRimanente: dbUser.tokens
  };
  
}



  //crea un nuovo grafo
async createGraph(
  data: { nome: string; struttura: object },
  user: AuthUser
) {
  this.logger.info(`createGraph: nome = ${data.nome}`);

  const existing = await GraphEntity.findOne({ where: { nome: data.nome, userId: user.id } });
  if (existing) {
    this.logger.error(`createGraph: grafo ${data.nome} già esistente`);
    throw new Error("Grafo con lo stesso nome già esistente");
  }

  const entity = await GraphEntity.create({
    nome: data.nome,
    data: data.struttura,
    stato: "Creato",
    userId: user.id
  });

  const model = new GraphModel();
  await model.inizializza(entity.id);
  const costo = await model.calcolaCosto();

  // Trova l'utente nel DB e scala i token
  const dbUser = await User.findByPk(user.id);
  if (!dbUser) throw new Error("Utente non trovato");

  if (dbUser.tokens < costo) {
    throw new Error(`Credito insufficiente. Servono ${costo}, hai ${dbUser.tokens}`);
  }

  dbUser.tokens -= costo;
  await dbUser.save();

  const updated = await GraphEntity.findByPk(entity.id);
  if (!updated) throw new Error("Errore interno: grafo non trovato dopo creazione");

  return {
    id: updated.id,
    stato: updated.stato,
    costo: updated.costo,
    creditoRimanente: dbUser.tokens
  };
}


//recupera tutti i grafi
async getAllGraphs() {
    this.logger.info("getAllGraphs");
    const graph = new GraphModel();
    return graph.getAll();
  }

  //aggiorna il peso di un arco
async updateWeight(id: number, from: string, to: string, newWeight: number) {
    this.logger.info(`updateWeight: grafo ${id}, da ${from} a ${to}, peso=${newWeight}`);
    const graph = new GraphModel();
    await graph.inizializza(id);
    await graph.updateWeight(from, to, newWeight);
  }
//cambia lo stato di un grafo
async setState(id: number, state: string) {
    this.logger.info(`setState: grafo ${id} -> ${state}`);
    const graph = await GraphEntity.findByPk(id);
    if (!graph) throw new Error("Grafo non trovato");
    graph.stato = state;
    await graph.save();
  }

 //calcola il costo di un grafo
  async getGraphCost(id: number) {
    this.logger.info(`getGraphCost: grafo ${id}`);
    const graph = new GraphModel();
    await graph.inizializza(id);
    return await graph.calcolaCosto();
  }
  //simula variazioni di peso
  async simulateGraph(id: number, from: string, to: string, wStart: number, wEnd: number, step: number) {
    this.logger.info(`simulateGraph: grafo ${id}, from ${from} to ${to}, range ${wStart}-${wEnd} step ${step}`);
    const graph = new GraphModel();
    await graph.inizializza(id);
    return graph.simula(from, to, wStart, wEnd, step);
  }
//ricarica i token di un utente (solo admin)
async rechargeUserTokens(email: string, tokens: number) {
  this.logger.info(`rechargeUserTokens: ${email} +${tokens}`);

  if (tokens < 0) {
    throw new Error("Non è possibile assegnare un credito negativo.");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Utente non trovato");

  user.tokens = tokens;
  await user.save();

  return user;
}
async getGraphVersions(
  graphId: number,
  filters?: {
    updatedAt?: string;  // data ISO string o parziale
    nNodes?: number;
    nEdges?: number;
  }
) {
  this.logger.info(`getGraphVersions: graphId=${graphId}, filters=${JSON.stringify(filters)}`);

  const whereClause: any = { graphId };

  if (filters) {
    if (filters.updatedAt) {
      // filtro per data (puoi estenderlo con range, qui filtro per data >= fornita)
      whereClause.updatedAt = { [Op.gte]: new Date(filters.updatedAt) };
    }
    if (filters.nNodes !== undefined) {
      whereClause.nNodes = filters.nNodes;
    }
    if (filters.nEdges !== undefined) {
      whereClause.nEdges = filters.nEdges;
    }
  }

  const versions = await GraphVersionEntity.findAll({
    where: whereClause,
    order: [["updatedAt", "DESC"]],
  });

  return versions;
}

}

export default ConcreteGraphMediator;