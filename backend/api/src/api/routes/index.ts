import { getDocs } from './docs/getDocs';
import { createFolder } from './folders/createFolder';
import { deleteFolder } from './folders/deleteFolder';
import { getFolder } from './folders/getFolder';
import { getFolders } from './folders/getFolders';
import { updateFolder } from './folders/updateFolder';
import { setupRoutes } from '../../util/setupRoutes';
import { createFolderFile } from './folders/files/createFolderFile';
import { deleteFolderFile } from './folders/files/deleteFolderFile';
import { getFolderFile } from './folders/files/getFolderFile';
import { getFolderFiles } from './folders/files/getFolderFiles';
import { updateFolderFile } from './folders/files/updateFolderFile';

export const routes = setupRoutes((router) => {
  router.get('/folders', getFolders)
  router.post('/folders', createFolder);
  router.get('/folders/:folderId', getFolder);
  router.post('/folders/:folderId', updateFolder);
  router.delete('folders/:folderId', deleteFolder);

  router.get('/folders/:folderId/files', getFolderFiles);
  router.post('/folders/:folderId/files', createFolderFile);
  router.get('/folders/:folderId/files/:fileId', getFolderFile);
  router.post('/folders/:folderId/files/:fileId', updateFolderFile);
  router.delete('/folders/:folderId/files/:fileId', deleteFolderFile);

  router.get('/docs', getDocs);
})
