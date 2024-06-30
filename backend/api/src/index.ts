// src/index.js
import dotenv from 'dotenv';
import { createApi } from './api';

dotenv.config();

const port = process.env.PORT || 3000;

const api = createApi();

api.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
