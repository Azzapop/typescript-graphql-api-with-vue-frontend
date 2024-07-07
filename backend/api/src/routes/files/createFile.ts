import type { Files } from '@services/api';
import { randomInt } from 'crypto';

export const createFile: Files.CreateFile.Handler = (req, res) => {
  const {
    body: { name },
  } = req;
  const file = { id: randomInt(9999), name };
  res.json({ file });
};
