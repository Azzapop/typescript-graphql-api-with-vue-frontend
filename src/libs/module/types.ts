import type { Express } from 'express';
import type { Server as HttpServer } from 'http';

export type ModuleContext = {
  httpServer?: HttpServer;
};

export type Module = {
  path: string;
  createRouter: () => Express;
};
