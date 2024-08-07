import type { Request, Response } from 'express';
import path from 'path';

export const getDocs = (_req: Request, res: Response) => {
  console.log('test2');
  res.sendFile(path.join(__dirname + '/index.html'));
};
