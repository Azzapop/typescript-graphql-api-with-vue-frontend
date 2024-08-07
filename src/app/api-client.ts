import { FoldersClient, HttpClient } from '@services/api';

const http = new HttpClient({ url: 'http://localhost:3000/api', auth: { username: 'test', password: 'test' } });
export const apiClient = new FoldersClient(http);
