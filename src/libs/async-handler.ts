import { RequestHandler } from 'express';

// TODO better typing here
type Handler = RequestHandler<any, any, any, any, any>;

export const asyncHanlder = (handler: Handler) => {
  const wrapper: Handler = (req, res, next): Promise<void> => {
    const handlerReturn = handler(req, res, next);
    return Promise.resolve(handlerReturn).catch(next);
  };

  return wrapper;
};
