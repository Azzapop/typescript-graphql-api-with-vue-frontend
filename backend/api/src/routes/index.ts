import type { Router } from 'express';
import { getDocs } from './docs/getDocs';
import { createFile } from './files/createFile';
import { deleteFile } from './files/deleteFile';
import { getFile } from './files/getFile';
import { getFiles } from './files/getFiles';
import { updateFile } from './files/updateFile';
import { createFolder } from './folders/createFolder';
import { deleteFolder } from './folders/deleteFolder';
import { getFolder } from './folders/getFolder';
import { getFolders } from './folders/getFolders';
import { updateFolder } from './folders/updateFolder';

export const injectRoutes = (router: Router): Router => {
  router.get('/folders', getFolders);
  router.post('/folders', createFolder);
  router.get('/folders/:folderId', getFolder);
  router.post('/folders/:folderId', updateFolder);
  router.delete('folders/:folderId', deleteFolder);

  router.get('/files', getFiles);
  router.post('/files', createFile);
  router.get('/files/:fileId', getFile);
  router.post('/files/:fileId', updateFile);
  router.delete('files/:fileId', deleteFile);

  router.get('/docs', getDocs);

  return router;
};
