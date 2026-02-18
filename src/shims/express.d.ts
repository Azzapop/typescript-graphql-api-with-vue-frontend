import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Express.User;
    getUser: () => Express.User;
    issueNewTokens?: boolean;
  }
}
