import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const getFolder: Folders.GetFolder.Handler = async (req, res) => {
  const {
    params: { folderId: id },
  } = req;

  const folder = await prisma.folder.findUnique({ where: { id } });

  if (folder) {
    res.json({ folder });
  } else {
    // TODO 404 response
    res.status(404).json();
  }
};
