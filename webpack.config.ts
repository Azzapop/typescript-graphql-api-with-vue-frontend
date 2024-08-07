import merge from 'webpack-merge';
import baseConfig from './.webpack/base.config';
import clientConfig from './.webpack/client.config';
import devConfig from './.webpack/dev.config';
import prodConfig from './.webpack/prod.config';

type Args = {
  mode?: 'development' | 'production' | 'client';
};

export default (_env: unknown, args: Args) => {
  switch (args.mode) {
    case 'development':
      return devConfig;
    case 'client':
      return clientConfig;
    case 'production':
      return [merge(baseConfig, prodConfig), clientConfig];
    default:
      throw new Error('No matching configuration was found!');
  }
};
