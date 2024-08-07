import NodemonPlugin from 'nodemon-webpack-plugin';
import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './base.config';
import clientConfig from './client.config';

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
    errorStack: true,
    errorDetails: true,
  },
};

export default [merge(baseConfig, config), clientConfig];
