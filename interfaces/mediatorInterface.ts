export default interface Mediator {
  executeGraph(id: number, start: string, goal: string): Promise<any>;
  createGraph(data: object): Promise<any>;
  getAllGraphs(): Promise<any[]>;


}
