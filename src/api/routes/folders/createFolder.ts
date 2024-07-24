import { asyncHanlder } from '@libs/async-handler';
import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

const handler: Folders.CreateFolder.Handler = async (req, res) => {
  const {
    body: { name },
  } = req;

  const folder = await prisma.folder.create({ data: { name } });

  res.json({ folder });
};

export const createFolder = asyncHanlder(handler);
