import GraphController from '../controllers/GraphController';
import { Request, Response, NextFunction } from 'express';

describe('GraphController', () => {
  it('updateWeightHandler restituisce nuovo peso', async () => {
    const controller = new (GraphController as any)(); // bypass costruttore con argomento

    // Mock req/res
    const req = {
      params: { id: '1' },
      body: { from: 'A', to: 'B', peso: 10 }
    } as unknown as Request;

    const json = jest.fn();
    const res = { json } as unknown as Response;

    const next = jest.fn();

    // Cast per accedere a metodo "privato" (solo nei test)
    await (controller as any).updateWeightHandler(req, res, next);

    expect(json).toHaveBeenCalledWith({ nuovoPeso: expect.any(Number) });
  });
});
