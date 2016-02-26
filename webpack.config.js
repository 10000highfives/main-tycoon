const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'main.js'),
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'baxbel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
