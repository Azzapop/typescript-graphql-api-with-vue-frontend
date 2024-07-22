import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import yaml from 'yamljs';
import nodeExternals from 'webpack-node-externals';

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
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsConfigPathsPlugin({ configFile: 'tsconfig.webpack.json' }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Index',
      inject: false,
      filename: 'index.html',
      template: './src/api/routes/docs/index.html',
      chunks: ['index'],
    }),
    new NodePolyfillPlugin(),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'), // TODO better way for this
    clean: true,
  },
  externals: [nodeExternals()],
}

export default config;
