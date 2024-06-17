import { Request, Response } from 'express';

export const get = (_req: Request, res: Response) => {
  res.json({ get: true });
};
