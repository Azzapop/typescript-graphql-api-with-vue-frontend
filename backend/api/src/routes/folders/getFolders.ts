import type { Folders } from '@services/api';
import { randomInt, randomUUID } from 'crypto';

export const getFolders: Folders.GetFolders.Handler = (req, res) => {
  const {
    query: { limit },
  } = req;

  const folders = [];
  for (let i = 0; i < limit; i++) {
    folders.push({ id: randomInt(9999), name: randomUUID() });
  }

  res.json({ folders });
};
