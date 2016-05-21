var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: "./src/scripts/index.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: ["", ".ts", ".js"]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.jade$/,
                loader: "jade-loader"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.jade',
        inject: 'body'
      })

    ]
};

module.exports = config;
