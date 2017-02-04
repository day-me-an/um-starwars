var webpack = require('webpack')
var CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

module.exports = {
  entry: [
    './src/index.tsx'
  ],

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader?useCache=true' }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin([
      { from: 'static/' },
    ])
  ]
}