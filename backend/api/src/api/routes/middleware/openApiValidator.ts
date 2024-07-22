import * as OpenApiValidator from 'express-openapi-validator';
// TODO typescript not finding this file if not correct path
import swagger from '../../swagger.yaml';

export const openApiValidator = OpenApiValidator.middleware({
  apiSpec: swagger,
  validateRequests: true,
  validateResponses: true,
  ignorePaths: /.*\/docs$/,
});
