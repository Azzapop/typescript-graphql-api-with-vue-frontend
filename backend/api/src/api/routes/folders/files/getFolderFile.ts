import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const getFolderFile: Folders.GetFolderFile.Handler = async (req, res) => {
  const {
    params: { fileId: id, folderId },
  } = req;

  const file = await prisma.file.findUnique({ where: { folderId, id } })

  if (file) {
    res.json({ file });
  } else {
    // TODO 404 response body
    res.status(404);
  }
};
