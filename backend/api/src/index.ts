// We must import our aliases first to ensure we can import everything correctly in production``
// Import everything else
import dotenv from 'dotenv';
import 'module-alias/register';
import { server } from './server';

dotenv.config();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
