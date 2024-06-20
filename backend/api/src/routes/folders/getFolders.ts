import { randomInt, randomUUID } from 'crypto';
import { Request, Response } from 'express';

export const getFolder = (req: Request, res: Response) => {
  const limit: number = Number(req.params.limit) || 100;

  const folders = [];
  for (let i = 0; i < limit; i++) {
    folders.push({ id: randomInt(9999), name: randomUUID() });
  }

  res.json({ folders });
};
