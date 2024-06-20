import { Request, Response } from 'express';

export const createFolder = (req: Request, res: Response) => {
  const { params, body } = req;
  const id = params.folderId;
  const name = body.name;

  const folder = { id, name };

  res.json({ folder });
};
