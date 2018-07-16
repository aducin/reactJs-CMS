var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src/app');

const VENDOR_LIBS = [
  'react',
  'react-bootstrap',
  'react-datepicker',
  'react-dom',
  'react-redux',
  'react-router',
  'react-styleable',
  'react-tooltip',
  'redux',
  'redux-logger',
  'redux-promise-middleware',
  'redux-thunk',
  'axios',
  'bootstrap',
  'bootstrap-without-jquery',
  'moment',
  'prop-types'
];

var config;
process.traceDeprecation = true;
config = {
  entry: {
    bundle: APP_DIR + '/index.js',
    vendor: VENDOR_LIBS 
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].[chunkhash].js'
  },
  module: {
    loaders: [
    { 
      test: /\.css$/, 
      loader: "style-loader!css-loader" 
    },
    { 
      test: /\.scss$/, 
      loader: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ]
    },
    { 
      test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
      loader: 'url-loader?limit=100000' 
    },
    {
      test: /\.jsx?/,
      include: APP_DIR,
      loader: 'babel-loader',
      query:
      {
       presets: ['es2015', 'stage-0', 'react'],
       plugins: ["transform-decorators-legacy", "transform-class-properties"]
     }
   }
   ]
 },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: APP_DIR + '/index.html',
    })
	/*
	new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new UnminifiedWebpackPlugin()
        */
	/*
        new webpack.DefinePlugin({
		  "process.env": { 
		     NODE_ENV: JSON.stringify("production") 
		   }
		}),
        new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		})
        */
    ]
};

module.exports = config;