// src/index.js
import express, { Router, Express } from 'express';
import dotenv from 'dotenv';
import { injectRoutes } from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

let router = Router();
router = injectRoutes(router);
app.use(router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
