import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';

export const getFolder = (req: Request, res: Response) => {
  const {
    params: { folderId: id },
  } = req;

  const folder: unknown = { id, name: randomUUID() };
  res.json({ folder });
};
