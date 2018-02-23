const path = require('path');
const webpack = require('webpack');

console.log(path.resolve('bin'));
const LIBRARY_NAME = 'ng-dynamic-model';

module.exports = {
    entry: {
        [LIBRARY_NAME]: './index.js',
        [`${LIBRARY_NAME}.min`]: './index.js'
    },

    output: {
        path: path.resolve('./bin'),
        publicPath: 'bin/',
        filename: '[name].js'
    },

    resolve: {
        extensions: [ '.webpack.js', '.web.js', '.js' ]
    },

    module: {
        loaders: [
            { 
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            mangle: {
                screw_ie8: true,
                keep_fnames: false
            },
            compress: {
                screw_ie8: true,
                warnings: false
            }
        })
    ]
};
