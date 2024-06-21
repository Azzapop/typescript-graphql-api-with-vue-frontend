import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

export const deleteFolder = (req: Request, res: Response) => {
  const { id } = req.params;
  const name = randomUUID();

  const deletedFolder = { id, name };

  res.json({ deletedFolder });
};
