import type { Folders } from '@services/api';
import { randomUUID } from 'crypto';

export const deleteFolder: Folders.DeleteFolder.Handler = (req, res) => {
  const {
    params: { folderId },
  } = req;
  const name = randomUUID();

  const deletedFolder = { id: folderId, name };

  res.json({ deletedFolder });
};
