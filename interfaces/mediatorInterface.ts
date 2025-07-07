import { GraphState } from "./graphState";

export interface Mediator {
setState(id: number, state: string): Promise<void>;
createGraph(data: object): Promise<any>;
executeGraph(id: number, start: string, goal: string): Promise<any>;    
updateWeight(id: number, from: string, to: string, newWeight: number): Promise<void>;
getAllGraphs(): Promise<any>;
simulateGraph(id: number, from: string, to: string, wStart: number, wEnd: number, step: number): Promise<any>;
rechargeUserTokens(email: string, tokens: number): Promise<any>;


}
