const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        ObservableObject: "./src/jsutils/ObservableObject.js"
    },
    output: {
        library: "ObservableObject",
        libraryTarget: "umd",
        filename: "[name].js",
        path: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            beautify: true,
            mangle: false,
            compress: {
                warnings: false,
                collapse_vars: false,
                sequences: false,
                // conditionals: false,
                comparisons: false,
                booleans: false,
                //evaluate:       false,
                hoist_funs: false,
                join_vars: false,
                if_return: false,
                cascade: false
            }
        })
    ]
};