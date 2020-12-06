const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const buildPath = path.resolve(__dirname, 'dist')

const isDev = process.env.NODE_ENV === 'development'

const pages = ['index', 'aboutUs', 'contacts']

module.exports = {
  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: isDev ? 'source-map' : 'inline-source-map',

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    ...pages.reduce((entry, pageName) => {
      entry[pageName] = `./src/js/${pageName}.js`
      return entry
    }, {}),
    polyfill: '@babel/polyfill'
  },

  // how to write the compiled files to disk
  // https://webpack.js.org/concepts/output/
  output: {
    filename: '[name].[hash].js',
    path: buildPath
  },

  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      }
    ]
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new CleanWebpackPlugin(),
    ...pages.map((file) => {
      return new HtmlWebpackPlugin({
        template: `./src/pages/${file}.html`,
        inject: 'body',
        chunks: [file, 'polyfill'],
        filename: `${file}.html`,
        chunksSortMode: (chunk1, chunk2) => {
          const orders = ['polyfill', file]
          const order1 = orders.indexOf(chunk1)
          const order2 = orders.indexOf(chunk2)
          if (order1 > order2) {
            return 1
          } else if (order1 < order2) {
            return -1
          } else {
            return 0
          }
        }
      })
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
  ],

  // https://webpack.js.org/configuration/optimization/
  optimization: !isDev
    ? {
        minimize: true,
        splitChunks: {
          chunks: 'all'
        },
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
          }),
          new OptimizeCssAssetsPlugin({})
        ]
      }
    : {
        splitChunks: {
          chunks: 'all'
        }
      }
}
