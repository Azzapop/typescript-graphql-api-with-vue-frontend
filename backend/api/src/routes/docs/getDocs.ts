import path from 'path';
import { Request, Response } from 'express';

export const getDocs = (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/index.html'));
};
