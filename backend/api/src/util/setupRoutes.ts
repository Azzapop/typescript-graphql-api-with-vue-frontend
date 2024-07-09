import { Router } from "express";

type CallbackFunc = (router: Router) => void

export const setupRoutes = (cb: CallbackFunc): Router => {
  const router = Router();
  cb(router);
  return router;
}
