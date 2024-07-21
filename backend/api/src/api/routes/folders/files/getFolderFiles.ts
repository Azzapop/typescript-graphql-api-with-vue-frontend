import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const getFolderFiles: Folders.GetFolderFiles.Handler = async (
  req,
  res
) => {
  const {
    query: { limit },
    params: { folderId },
  } = req;

  const files = await prisma.file.findMany({
    where: { folderId },
    take: limit,
  });

  res.json({ files });
};
