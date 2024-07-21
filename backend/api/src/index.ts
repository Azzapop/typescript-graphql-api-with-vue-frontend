import dotenv from 'dotenv';
import { server } from './server';

// "./node_modules/@trivago/prettier-plugin-sort-imports/lib/src/index.js",

dotenv.config();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
