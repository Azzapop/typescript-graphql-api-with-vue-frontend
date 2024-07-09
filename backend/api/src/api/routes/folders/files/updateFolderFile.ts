import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const updateFolderFile: Folders.UpdateFolderFile.Handler = async (req, res) => {
  const { params, body } = req;
  const { fileId: id, folderId } = params;
  const { name } = body;

  const file = await prisma.file.update({ where: { id, folderId }, data: { name } })

  res.json({ file });
};
