import defaultConfig from './jest.config';

const config = {
  ...defaultConfig,
  testRegex: ['\\.int\\.spec\\.ts'],
};

export default config;
