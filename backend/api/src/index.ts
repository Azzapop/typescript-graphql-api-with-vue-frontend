// src/index.js
import express, { Router, Express } from 'express';
import dotenv from 'dotenv';
import { injectRoutes } from './routes';
import { openApiValidator } from './middleware/openApiValidator';
import { errorHandler } from './middleware/error-handler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

let router = Router();
router = injectRoutes(router);
app.use(router);

app.use(openApiValidator);
// Our error handler must be last to ensure that we handle all errors that could arise
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
