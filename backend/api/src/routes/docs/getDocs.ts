import type { Request, Response } from 'express';
import path from 'path';

export const getDocs = (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/index.html'));
};
