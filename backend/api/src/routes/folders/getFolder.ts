import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

export const getFolder = (req: Request, res: Response) => {
  const { folderId: id } = req.params;

  const folder: unknown = { id, name: randomUUID() };
  res.json({ folder });
};
