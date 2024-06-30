import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';

export const deleteFolder = (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  const name = randomUUID();

  const deletedFolder = { id, name };

  res.json({ deletedFolder });
};
