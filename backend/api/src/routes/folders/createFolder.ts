import { randomInt } from 'crypto';
import type { Request, Response } from 'express';

export const createFolder = (req: Request, res: Response) => {
  const {
    body: { name },
  } = req;
  const folder = { id: randomInt(9999), name };
  res.json({ folder });
};
