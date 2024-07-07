import type { File, Files } from '@services/api';
import { randomUUID } from 'crypto';

export const getFile: Files.GetFile.Handler = (req, res) => {
  const {
    params: { fileId: id },
  } = req;

  const file: File = { id, name: randomUUID() };
  res.json({ file });
};
