import type { Express } from 'express';
import { logger } from '~libs/logger';
import type { Module } from './types';

export const mountModules = (server: Express, modules: Module[]): void => {
  const paths = modules.map((m) => m.path);
  const uniquePaths = new Set(paths);

  if (paths.length !== uniquePaths.size) {
    const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
    throw new Error(
      `Duplicate module paths detected: ${duplicates.join(', ')}`
    );
  }

  for (const module of modules) {
    const router = module.createRouter();
    server.use(module.path, router);
    logger.system.info(`Mounted module at ${module.path}`);
  }
};
