const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: {
    login: path.join(__dirname, '/assets/Login.js'),
    connectFour: path.join(__dirname, '/assets/ConnectFour.js'),
    waiting: path.join(__dirname, '/assets/Waiting.js'),
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
  // plugins: [
  //  new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  // ]
};
