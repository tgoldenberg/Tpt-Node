var webpack = require('webpack');
var path = require('path');
var outputFile = 'tpt.js';
var fs = require('fs');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV;
var libraryName = 'tpt-api';

var outputFile;
var plugins = [ ];

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + 'min.js';
} else {
  outputFile = libraryName + '.js';
}

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  target: 'node',
  output: {
    path: __dirname + '/lib',
    filename: outputFile
  },
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  // resolve: {
  //   root: path.resolve('./src'),
  //   extensions: [ '', '.js' ]
  // },
  plugins: plugins
};

module.exports = config;
