import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import type { Express } from 'express';
import pinoHttp from 'pino-http';
import { isViteRequest, logger } from '~libs/logger';
import { trace } from '~libs/trace-context';
import type { Module, ModuleContext } from './module-types';

type CreateModuleOptions = {
  path: string;
  appName: string;
  configure: (router: Express, context: ModuleContext) => void | Promise<void>;
};

export const createModule = async (
  options: CreateModuleOptions,
  context: ModuleContext = {}
): Promise<Module> => {
  const { path, configure, appName } = options;

  const router = express();

  // Common middleware
  router.use(trace(appName));
  router.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => {
          // Only relevant for dev due to the vite dev server
          return isViteRequest(req);
        },
      },
    })
  );
  router.use(cors());
  router.use(json());
  router.use(cookieParser());

  await configure(router, context);

  return {
    path,
    createRouter: () => router,
  };
};
