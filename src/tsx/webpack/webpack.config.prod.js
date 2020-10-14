const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const prodConfig = {
  mode: 'production',
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  module: {
    rules: [
      // {
      //     test: /\.css$/,
      //     loader: [MiniCssExtractPlugin.loader, 'css-loader?modules'],
      // },
    ],
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //     filename: "main.min.css"
    // }),
    new CleanWebpackPlugin(),
  ],
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
};
module.exports = merge(prodConfig, baseConfig);
