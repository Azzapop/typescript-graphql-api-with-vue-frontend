import type { Router } from 'express';
import { getDocs } from './docs/getDocs';
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

  router.get('/docs', getDocs);

  return router;
};
