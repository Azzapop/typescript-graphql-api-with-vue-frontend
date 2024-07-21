import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const createFolder: Folders.CreateFolder.Handler = async (req, res) => {
  const {
    body: { name },
  } = req;

  console.log('here');
  const folder = await prisma.folder.create({ data: { name } });
  console.log('here2');

  res.json({ folder });
};
