import webpack from 'webpack';
import path from 'path';
import {YOUTUBE_INFO} from './tools/private/youtubeInfo';

const GLOBALS = {
    'process.env': {
        'CLIENT_ID': JSON.stringify(YOUTUBE_INFO.CLIENT_ID),
        'YOUTUBE_KEY': JSON.stringify(YOUTUBE_INFO.API_KEY),
        'CHANNEL_ID': JSON.stringify(YOUTUBE_INFO.CHANNEL_ID)
    }
};

export default {
    devtool: 'inline-source-map',
    entry: [
        'eventsource-polyfill', // necessary for hot reloading with IE
        'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
        path.resolve(__dirname, 'src/index')
    ],
    target: 'web',
    output: {
        path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'src')
    },
    plugins: [
        new webpack.DefinePlugin(GLOBALS),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true,
            noInfo: false
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.join(__dirname, 'src'), path.join(__dirname,'analytics')],
                use: 'babel-loader'
            },
            {test: /(\.css)$/, use: ['style-loader', 'css-loader']},
            {test: /(\.scss)$/, use: ['style-loader', 'css-loader', 'sass-loader']},
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
