import express from 'express';
import type { Express } from 'express';
import type { Module, ModuleContext } from './types';

type CreateModuleOptions = {
  path: string;
  configure: (router: Express, context: ModuleContext) => void | Promise<void>;
};

export const createModule = async (
  options: CreateModuleOptions,
  context: ModuleContext = {}
): Promise<Module> => {
  const { path, configure } = options;

  const createRouter = (): Express => {
    const router = express();
    return router;
  };

  const router = createRouter();
  await configure(router, context);

  return {
    path,
    createRouter: () => router,
  };
};
