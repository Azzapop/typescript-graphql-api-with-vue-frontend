import type { Folders } from '@services/api';
import { prisma } from '@services/domain-model/prisma';

export const deleteFolderFile: Folders.DeleteFolderFile.Handler = async (
  req,
  res
) => {
  const {
    params: { folderId, fileId },
  } = req;

  const file = await prisma.file.delete({ where: { folderId, id: fileId } });

  res.json({ deletedFile: file });
};
