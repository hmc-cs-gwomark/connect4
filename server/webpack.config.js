const path = require('path');
const webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    login: path.join(__dirname, '/assets/Login.js'),
    game: path.join(__dirname, '/assets/Game.js'),
    index: path.join(__dirname, 'assets/index.js'),
    serviceWorker: path.join(__dirname, 'assets/registerServiceWorker.js')
  },
  output: {
    path: path.join(__dirname, '/static'),
    filename: '[name]-bundle.js'
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: 'babel-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, '/assets'),
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?sourceMap'
        ]
      }
    ]
  },
  resolveLoader: {
      // An array of directory names to be resolved to the current directory
      modules: ['node_modules', path.join(__dirname, '/assets')],
   },
  plugins: [
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8})

  ],
  optimization: {
    minimize: true,
    nodeEnv: 'production',
    splitChunks: {
      chunks: 'all'
    }
  }

};
