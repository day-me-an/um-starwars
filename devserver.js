var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackConfig = require('./webpack.config')

var devserverConfig = {
  hot: true,
  historyApiFallback: true
}

new WebpackDevServer(webpack(webpackConfig), devserverConfig).listen(8081, null, function (err, result) {
  if (err) {
    console.log(err)
  }

  console.log('Listening...')
})
