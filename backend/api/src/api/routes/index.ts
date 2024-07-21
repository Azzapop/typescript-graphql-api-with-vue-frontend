import type { Routes } from '@libs/create-express-module/types';
import { getDocs } from './docs/getDocs';
import { createFolder } from './folders/createFolder';
import { deleteFolder } from './folders/deleteFolder';
import { createFolderFile } from './folders/files/createFolderFile';
import { deleteFolderFile } from './folders/files/deleteFolderFile';
import { getFolderFile } from './folders/files/getFolderFile';
import { getFolderFiles } from './folders/files/getFolderFiles';
import { updateFolderFile } from './folders/files/updateFolderFile';
import { getFolder } from './folders/getFolder';
import { getFolders } from './folders/getFolders';
import { updateFolder } from './folders/updateFolder';
import { jsonBodyParser } from './middleware/jsonBodyParser';
import { openApiValidator } from './middleware/openApiValidator';

export const routes: Routes = [
  ['*', { USE: [jsonBodyParser, ...openApiValidator] }],
  [
    '/folders',
    {
      GET: [getFolders],
      POST: [createFolder],
    },
  ],
  [
    '/folders/:folderId',
    {
      GET: [getFolder],
      POST: [updateFolder],
      DELETE: [deleteFolder],
    },
  ],
  [
    'folders/:folderId/files',
    {
      GET: [getFolderFiles],
      POST: [createFolderFile],
    },
  ],
  [
    '/folders/:folderId/files/:fileId',
    {
      GET: [getFolderFile],
      POST: [updateFolderFile],
      DELETE: [deleteFolderFile],
    },
  ],
  ['/docs', { GET: [getDocs] }],
];
