import type { Request, Response } from 'express';

export const updateFolder = (req: Request, res: Response) => {
  const { params, body } = req;
  const { folderId: id } = params;
  const { name } = body;

  const folder = { id, name };

  res.json({ folder });
};
