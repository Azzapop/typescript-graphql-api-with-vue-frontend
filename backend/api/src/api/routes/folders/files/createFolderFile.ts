import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const createFolderFile: Folders.CreateFolderFile.Handler = async (req, res) => {
  const {
    body: { name },
    params: { folderId },
  } = req;

  const file = await prisma.file.create({ data: { folderId, name } })

  res.json({ file });
};
