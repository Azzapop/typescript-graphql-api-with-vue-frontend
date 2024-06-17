import { Request, Response } from 'express';

export const post = (_req: Request, res: Response) => {
  res.json({ post: true });
};
