import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {YOUTUBE_INFO} from './tools/private/youtubeInfo';

const GLOBALS = {
    'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'YOUTUBE_KEY': JSON.stringify(YOUTUBE_INFO.API_KEY),
        'CHANNEL_ID': JSON.stringify(YOUTUBE_INFO.CHANNEL_ID)
    }
};

export default {
    debug: true,
    devtool: 'source-map',
    noInfo: false,
    entry: path.resolve(__dirname, 'src/index'),
    target: 'web',
    output: {
        path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin(GLOBALS),
        new ExtractTextPlugin('styles.css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            favicon: 'src/images/favicon.ico',
            template: 'src/index.html',
            inject: false
        })
    ],
    module: {
        loaders: [
            {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
            {test: /(\.css)$/, loader: ExtractTextPlugin.extract("css?sourceMap")},
            {test: /(\.scss)$/, loader: ExtractTextPlugin.extract("style", "css!sass")},
            {test: /\.(jpe?g|ico|gif|png|svg|eot|woff|woff2|ttf)$/, loader: 'file', options: {name: '[path][name].[hash].[ext]'}}
        ]
    }
};