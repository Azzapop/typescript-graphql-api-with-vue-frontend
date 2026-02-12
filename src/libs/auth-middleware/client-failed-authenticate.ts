import type { Handler } from 'express';

type Opts = {
  isPublicRoute: (path: string) => boolean;
  loginPath: string;
};

export const clientFailedAuthenticate = (opts: Opts): Handler => {
  const { isPublicRoute, loginPath } = opts;

  return (req, res, next) => {
    const { user, originalUrl } = req;
    // Extract path from originalUrl (remove query string)
    const routePath = originalUrl.split('?')[0] ?? '/';

    if (isPublicRoute(routePath)) {
      return next();
    }

    if (!user) {
      return res.redirect(
        `${loginPath}?returnUrl=${encodeURIComponent(originalUrl)}`
      );
    }

    next();
  };
};
