import dotenv from 'dotenv';
import { server } from './server';

dotenv.config();

const port = process.env.PORT || 3000;
const httpServer = await server();

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

if (import.meta.hot) {
  console.log(import.meta)
  console.log(import.meta.hot);
  console.log('hot');
  import.meta.hot.on('*', (event) => {
    console.log({ event })
    console.log('thisone');
  });
}
