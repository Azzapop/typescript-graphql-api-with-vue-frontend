import type { Files } from '@services/api';

export const updateFile: Files.UpdateFile.Handler = (req, res) => {
  const { params, body } = req;
  const { fileId: id } = params;
  const { name } = body;

  const file = { id, name };

  res.json({ file });
};
