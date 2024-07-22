import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const createFolder: Folders.CreateFolder.Handler = async (req, res) => {
  const {
    body: { name },
  } = req;

  const folder = await prisma.folder.create({ data: { name } });

  res.json({ folder });
};
