import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {YOUTUBE_INFO} from './tools/private/youtubeInfo';

const GLOBALS = {
    'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'CLIENT_ID': JSON.stringify(YOUTUBE_INFO.CLIENT_ID),
        'YOUTUBE_KEY': JSON.stringify(YOUTUBE_INFO.API_KEY),
        'CHANNEL_ID': JSON.stringify(YOUTUBE_INFO.CHANNEL_ID)
    }
};

export default {
    devtool: 'source-map',
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
        new webpack.DefinePlugin(GLOBALS),
        new webpack.LoaderOptionsPlugin({
            debug: true,
            noInfo: false
        }),
        new ExtractTextPlugin({
            filename: 'styles.css'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [path.join(__dirname, 'src'), path.join(__dirname,'analytics')],
                use: 'babel-loader'
            },
            {
                test: /(\.css)$/, use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /(\.scss)$/, use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(jpe?g|ico|gif|png|svg|eot|woff|woff2|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {name: '[path][name].[hash].[ext]'}
                }]
            }
        ]
    }
};