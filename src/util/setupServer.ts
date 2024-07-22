import type { Express } from 'express';
import express from 'express';

export const setupServer = (opts: {
  modules: Record<string, Express>;
}): Express => {
  const { modules } = opts;

  const server = express();

  Object.entries(modules).forEach(([basePath, module]) => {
    server.use(basePath, module);
  });

  return server;
};
