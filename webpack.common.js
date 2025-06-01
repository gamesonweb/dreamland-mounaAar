const path                = require('path');
const fs                  = require('fs');
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: path.resolve(appDirectory, 'src/index.js'),

  output: {
    filename:      'js/[name].[contenthash].js',   // nom unique par entry
    chunkFilename: 'js/[name].[contenthash].js',   // nom unique pour les chunks dyn.
    path:          path.resolve('./dist')
  },

  resolve: {
    extensions: ['.ts', '.js'],
    fallback: { fs: false, path: false }
  },

  module: {
    rules: [
      { test: /\.m?js/ },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'ts-shader-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|env|gltf|bin|stl|dds|mp3|wav|ogg|mp4|glb|hdr)$/i,
        use: [{ loader: 'file-loader' }]
      },
      {
        test: /\.json$/i,
        type: 'javascript/auto',
        use: [{ loader: 'url-loader', options: { limit: 4096 } }]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      favicon: 'public/favicon.ico',          // adapte si déplacé
      template: path.resolve(appDirectory, 'public/index.html')
    })
  ]
};
