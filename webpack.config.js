const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js', // main file of your app
    output: {
        path: path.resolve(__dirname, 'dist'), // output directory
        filename: 'bundle.js' // name of the compiled bundle
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'] // file extensions to handle
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html' // updated path to your index.html in the public folder
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/favicon.ico', to: 'favicon.ico' }
            ]
        })
    ],
    devServer: {
        historyApiFallback: true,
    },
    devtool: 'inline-source-map',
};
