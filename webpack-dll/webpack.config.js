const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    main: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
  },

  devServer: {
    contentBase: './dist',
    port: '8080',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    // 当使用react的使用，先去这个表里面找
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json'),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
