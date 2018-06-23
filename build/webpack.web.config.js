"use strict"

process.env.BABEL_ENV = "web";

const path = require("path");
const { dependencies } = require("../package.json");
const webpack = require("webpack");
const utils = require("./utils");
const vueLoaderConfig = require("./vue.loader.config");

const BabiliWebpackPlugin = require("babili-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolve(dir)
{
    return path.join(__dirname, "..", dir);
}

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ["vue", "flagwind-core", "flagwind-web"];

let webConfig =
{
    target: "electron-renderer",
    devtool: "#cheap-module-eval-source-map",
    entry:
    {
        web: resolve("src/web/index.ts")
    },
    output:
    {
        filename: "js/[name].js",
        libraryTarget: "commonjs2",
        path: resolve("dist/web")
    },
    resolve:
    {
        extensions: [".ts", ".js", ".vue", ".json", ".node"],
        alias:
        {
            "vue$": "vue/dist/vue.esm.js",
            "src": resolve("src"),
            "web": resolve("src/web"),
            "config": resolve("src/web/config"),
            "assets": resolve("src/web/assets"),
            "styles": resolve("src/web/styles"),
            "components": resolve("src/web/components"),
            "models": resolve("src/web/models"),
            "services": resolve("src/web/services"),
            "views": resolve("src/web/views"),
            "utils": resolve("src/web/utils")
        }
    },
    externals:
    [
        ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
    ],
    module:
    {
        rules:
        [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: "pre",
                loader: "tslint-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options:
                {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.html$/,
                use: "vue-html-loader"
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: "node-loader"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: vueLoaderConfig
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use:
                {
                    loader: "url-loader",
                    query:
                    {
                        limit: 10000,
                        name: "images/[name].[ext]"
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options:
                {
                    limit: 10000,
                    name: "media/[name].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use:
                {
                    loader: "url-loader",
                    query:
                    {
                        limit: 10000,
                        name: "fonts/[name].[ext]"
                    }
                }
            }
        ]
    },
    node: 
    {
        __dirname: process.env.NODE_ENV !== "production",
        __filename: process.env.NODE_ENV !== "production"
    },
    plugins:
    [
        new ExtractTextPlugin
        ({
            filename: "styles.css",
            allChunks: true,
        }),
        new HtmlWebpackPlugin
        ({
            filename: "index.html",
            template: resolve("src/index.ejs"),
            minify:
            {
                collapseWhitespace: false,
                removeAttributeQuotes: false,
                removeComments: false
            },
            nodeModules: process.env.NODE_ENV !== "production" ? path.resolve(__dirname, "../node_modules") : false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}

webConfig.module.rules.push(...utils.styleLoaders
({
    sourceMap: false,
    extract: true,
    usePostCSS: true
}));

/**
 * Adjust webConfig for development settings
 */
if(process.env.NODE_ENV !== "production")
{
    webConfig.plugins.push
    (
        new webpack.DefinePlugin
        ({
            "__static": `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`
        })
    );
}

/**
 * Adjust webConfig for production settings
 */
if(process.env.NODE_ENV === "production")
{
    webConfig.devtool = "";

    webConfig.plugins.push
    (
        new BabiliWebpackPlugin(),
        new CopyWebpackPlugin
        ([
            {
                from: resolve("static"),
                to: resolve("dist/web/static"),
                ignore: [".*"]
            }
        ]),
        new webpack.DefinePlugin
        ({
            "process.env.NODE_ENV": '"production"'
        }),
        new webpack.LoaderOptionsPlugin
        ({
            minimize: true
        })
    );
}

module.exports = webConfig;
