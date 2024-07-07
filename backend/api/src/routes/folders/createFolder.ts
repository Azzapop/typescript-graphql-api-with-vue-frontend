import type { Folders } from '@services/api';
import { randomInt } from 'crypto';

export const createFolder: Folders.CreateFolder.Handler = (req, res) => {
  const {
    body: { name },
  } = req;
  const folder = { id: randomInt(9999), name };
  res.json({ folder });
};
