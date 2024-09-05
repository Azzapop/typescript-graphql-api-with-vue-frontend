import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { Configuration } from 'webpack';

const config: Configuration = {
  target: 'web',
  entry: {
    client: './src/client/client-entry.ts',
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
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue'],
    plugins: [new TsConfigPathsPlugin({ configFile: 'tsconfig.webpack.json' })],
  },
  plugins: [new ForkTsCheckerWebpackPlugin(), new VueLoaderPlugin()],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist/public'), // TODO better way for this
  },
};

export default config;
