const { merge } = require('webpack-merge');
const common    = require('./webpack.common.js');
const path      = require('path');
const fs        = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  devServer: {
    static: path.resolve(appDirectory),           
    host:   '0.0.0.0',                             
    port:   process.env.PORT || 8080,              
    allowedHosts: 'all',                           
    hot: true,
    compress: true,
    open: false                                   
  }
});
