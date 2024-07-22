import merge from 'webpack-merge';
import baseConfig from './.webpack/base.config';
import devConfig from './.webpack/dev.config';
import prodConfig from './.webpack/prod.config'

type Args = {
  mode?: 'development' | 'production'
}

export default (_env: unknown, args: Args) => {
  switch (args.mode) {
    case 'development':
      return merge(baseConfig, devConfig);
    case 'production':
      return merge(baseConfig, prodConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}
