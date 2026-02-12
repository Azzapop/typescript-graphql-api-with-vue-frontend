import type { Request } from 'express';

export const isViteRequest = (req: Request): boolean => {
  return (
    req.url.startsWith('/@vite') ||
    req.url.startsWith('/src/') ||
    req.url.startsWith('/node_modules/') ||
    req.url.startsWith('/@fs/') ||
    req.url.includes('vite') ||
    req.url.includes('.map') ||
    req.url.startsWith('/@id/')
  );
};
