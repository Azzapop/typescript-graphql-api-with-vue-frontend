import { Configuration } from 'webpack';
import NodemonPlugin from 'nodemon-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new NodemonPlugin({
      script: './dist/index.bundle.js',
      ext: 'ts,yml',
    }),
  ],
  stats: {
    errorDetails: true,
  },
}

export default config;
