import { randomInt } from 'crypto';
import { Request, Response } from 'express';

export const createFolder = (req: Request, res: Response) => {
  const { name } = req.body;
  const folder = { id: randomInt(9999), name };
  res.json({ folder });
};
