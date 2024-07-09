import type { Request, Response } from 'express';
import path from 'path';

export const getDocs = (_req: Request, res: Response) => {
  // TODO html file not getting built properly
  res.sendFile(path.join(__dirname + '/index.html'));
};
