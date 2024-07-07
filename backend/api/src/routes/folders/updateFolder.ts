import type { Folders } from '@services/api';

export const updateFolder: Folders.UpdateFolder.Handler = (req, res) => {
  const { params, body } = req;
  const { folderId: id } = params;
  const { name } = body;

  const folder = { id, name };

  res.json({ folder });
};
