import * as OpenApiValidator from 'express-openapi-validator';
import swagger from '../swagger.yaml';

export const openApiValidator = OpenApiValidator.middleware({
  apiSpec: swagger,
  validateRequests: true,
  validateResponses: true,
  ignorePaths: /.*\/docs$/,
});
