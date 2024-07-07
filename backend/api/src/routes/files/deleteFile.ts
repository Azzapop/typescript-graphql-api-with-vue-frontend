import type { Files } from '@services/api';
import { randomUUID } from 'crypto';

export const deleteFile: Files.DeleteFile.Handler = (req, res) => {
  const {
    params: { fileId },
  } = req;
  const name = randomUUID();

  const deletedFile = { id: fileId, name };

  res.json({ deletedFile });
};
