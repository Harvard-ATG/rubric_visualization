const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const BrotliPlugin = require('brotli-webpack-plugin');
  

module.exports = {
  devtool: '',
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './static/frontend/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /spec\.js$/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
};
