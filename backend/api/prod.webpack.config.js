const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const yaml = require('yamljs');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    index: './src/index.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
    alias: {
      '@services': path.resolve(__dirname, 'src/services'),
    },
    fallback: {
      net: false,
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Index',
      filename: 'index.html',
      template: './src/api/routes/docs/index.html',
      chunks: ['index'],
    }),
    new NodePolyfillPlugin(),
    new NodemonPlugin({
      script: './dist/index.bundle.js',
      ext: 'ts,yml',
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  externals: [nodeExternals()]
};
