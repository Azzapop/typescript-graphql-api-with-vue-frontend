import defaultConfig from './jest.config';

const config = {
  ...defaultConfig,
  testRegex: ['\\w*(?<!\\.int)\\.spec.ts'],
};

export default config;
