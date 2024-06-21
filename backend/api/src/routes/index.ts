import { Router } from 'express';
import { getFolder } from './folders/getFolder';
import { getFolders } from './folders/getFolders';
import { createFolder } from './folders/createFolder';
import { updateFolder } from './folders/updateFolder';
import { deleteFolder } from './folders/deleteFolder';
import { getDocs } from './docs/getDocs';

export const injectRoutes = (router: Router): Router => {
  router.get('/folders', getFolders);
  router.post('/folders', createFolder);
  router.get('/folders/:folderId', getFolder);
  router.post('/folders/:folderId', updateFolder);
  router.delete('folders/:folderId', deleteFolder);

  router.get('/docs', getDocs);

  return router;
};
