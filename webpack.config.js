const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = (env) => {
    return {
        entry: {
            bundle: "./bundle-config.js",
        },
        externals: [
            {
                window: "window",
            },
        ],
        output: {
            filename: "[name].js",
            chunkFilename: "chunks/[name].[contenthash].js",
            publicPath: "/dist",
            path: path.resolve(__dirname, "dist"),
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    include: /(\.min\.js$|bundle-vendors.js$)/,
                    extractComments: false,
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],
        },
        resolve: {
            alias: {
                vue$: "vue/dist/vue.esm.js",
            },
            extensions: ["*", ".js", ".vue", ".json"],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(patternslib)\/).*/,
                    loader: "babel-loader",
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                },
            ],
        },
        devServer: {
            port: "8000",
            host: "0.0.0.0",
        },
        plugins: [
            new CleanWebpackPlugin(),
            new DuplicatePackageCheckerPlugin({
                verbose: true,
                emitError: true,
            }),
            new VueLoaderPlugin(),
        ],
    };
};
