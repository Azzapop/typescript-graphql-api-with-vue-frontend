import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const deleteFolder: Folders.DeleteFolder.Handler = async (req, res) => {
  const {
    params: { folderId },
  } = req;

  const folder = await prisma.folder.delete({ where: { id: folderId } })

  res.json({ deletedFolder: folder });
};
