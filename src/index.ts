import { server } from './server';
import { serverConfig } from './server-config';

const port = serverConfig('PORT');

(async () => {
  const httpServer = await server();

  httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})();
