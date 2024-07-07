import type { Folder, Folders } from '@services/api';
import { randomUUID } from 'crypto';

export const getFolder: Folders.GetFolder.Handler = (req, res) => {
  const {
    params: { folderId: id },
  } = req;

  const folder: Folder = { id, name: randomUUID() };
  res.json({ folder });
};
