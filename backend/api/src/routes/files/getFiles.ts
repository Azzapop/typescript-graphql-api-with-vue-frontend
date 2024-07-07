import type { Files } from '@services/api';
import { randomInt, randomUUID } from 'crypto';

export const getFiles: Files.GetFiles.Handler = (req, res) => {
  const {
    query: { limit },
  } = req;

  const files = [];
  for (let i = 0; i < limit; i++) {
    files.push({ id: randomInt(9999), name: randomUUID() });
  }

  res.json({ files });
};
