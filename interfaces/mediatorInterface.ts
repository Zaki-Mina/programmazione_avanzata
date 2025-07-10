import { GraphVersionEntity } from "../db/GraphVersionEntity";
import { AuthUser } from "./AuthUser";

//un'interfaccia TypeScript che rappresenta un mediatore
export interface Mediator {
setState(id: number, state: string): Promise<void>;
createGraph(data: { nome: string; struttura: object }, user: AuthUser): Promise<any>;
executeGraph(id: number, start: string, goal: string): Promise<any>;    
updateWeight(id: number, from: string, to: string, newWeight: number): Promise<void>;
getAllGraphs(): Promise<any>;
simulateGraph(id: number, from: string, to: string, wStart: number, wEnd: number, step: number): Promise<any>;
rechargeUserTokens(email: string, tokens: number): Promise<any>;
getGraphVersions(graphId: number,filters?: { updatedAt?: string; nNodes?: number; nEdges?: number;}): Promise<GraphVersionEntity[]>;
}
