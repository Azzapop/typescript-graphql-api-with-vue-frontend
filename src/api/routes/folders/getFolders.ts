import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const getFolders: Folders.GetFolders.Handler = async (req, res) => {
  const {
    query: { limit },
  } = req;

  const folders = await prisma.folder.findMany({ take: limit });

  res.json({ folders });
};
