import * as OpenApiValidator from 'express-openapi-validator';

export const openApiValidator = OpenApiValidator.middleware({
  apiSpec: '../swagger.yaml',
  validateRequests: true,
  validateResponses: true,
});
