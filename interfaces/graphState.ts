export interface GraphState {
    execute(start: string, goal: string): Promise<any>;
    updateWeight(from: string, to: string, newWeight: number): any;
    simulate(from: string, to: string, wStart: number, wEnd: number, step: number): any;
    getState(): string;
    calcolaCosto?(): Promise<number>; // opzionale per stati che lo supportano

}
