var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, './js/app/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../public/js')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, 'js/lib/jquery-2.0.3.min'),
            mod: path.join(__dirname, 'js/mod'),
            scss: path.join(__dirname, 'scss')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new ExtractTextPlugin('../css/index.css'),
    ]
};