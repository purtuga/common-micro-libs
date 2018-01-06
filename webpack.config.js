const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const packageJson = require("./package.json");

module.exports = {
    entry: "./src/index.js",
    output: {
        library: "commonMicroLibs",
        libraryTarget: "umd",
        filename: `${ packageJson.name }.js`,
        path: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },
            {
                test:   /\.html$/,
                use:    ["raw-loader"]
            },
            {
                test:   /\.(eot|ttf|svg|woff|png|gif)(\?.*)?$/,
                use:    [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 150000
                        }
                    }
                ]
            }
        ]
    },
    devtool: "eval",
    devServer: {
        contentBase: [
            "./dist",
            "./dev"
        ],
        compress: true,
        port: 10109,
        openPage: "dev.html"
    },
    plugins: [
        // new UglifyJSPlugin({
        //     beautify: true,
        //     mangle: false,
        //     compress: {
        //         warnings: false,
        //         collapse_vars: false,
        //         sequences: false,
        //         // conditionals: false,
        //         comparisons: false,
        //         booleans: false,
        //         //evaluate:       false,
        //         hoist_funs: false,
        //         join_vars: false,
        //         if_return: false,
        //         cascade: false
        //     }
        // })
    ]
};