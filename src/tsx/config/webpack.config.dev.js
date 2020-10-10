const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.js');

const devConfig = {
  mode: 'development',
  entry: path.join(__dirname, '../example/src/app.js'), // 项目入口，处理资源文件的依赖关系
  output: {
    path: path.join(__dirname, '../example/src/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'notification library',
      filename: 'index.html',
      template: './public/index.html',
      inject: true,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, '../example/src/'),
    compress: true,
    port: 3333,
    open: true,
  },
};
module.exports = merge(devConfig, baseConfig);
