import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import path from 'path';
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import yaml from 'yamljs';

const config: Configuration = {
  target: 'node',
  entry: {
    index: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // Pass specific config file so we exclude spec files
          configFile: 'tsconfig.webpack.json',
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: [/node_modules/, /\.spec\.tsx?$/],
      },
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue'],
    plugins: [new TsConfigPathsPlugin({ configFile: 'tsconfig.webpack.json' })],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new NodePolyfillPlugin(),
    new VueLoaderPlugin(),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'), // TODO better way for this
    clean: true,
  },
  externals: [nodeExternals()],
};

export default config;
