import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const updateFolder: Folders.UpdateFolder.Handler = async (req, res) => {
  const { params, body } = req;
  const { folderId: id } = params;
  const { name } = body;

  const folder = await prisma.folder.update({ where: { id }, data: { name } });

  res.json({ folder });
};
