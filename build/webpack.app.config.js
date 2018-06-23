"use strict"

process.env.BABEL_ENV = "app";

const path = require("path");
const { dependencies } = require("../package.json");
const webpack = require("webpack");

const BabiliWebpackPlugin = require("babili-webpack-plugin");
 
let appConfig =
{
    target: "electron-main",
    resolve:
    {
        extensions: [".ts", ".js", ".json", ".node"]
    },
    entry:
    {
        app: path.join(__dirname, "../src/app/index.ts")
    },
    externals:
    [
        ...Object.keys(dependencies || {})
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
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: "node-loader"
            }
        ]
    },
    node:
    {
        __dirname: process.env.NODE_ENV !== "production",
        __filename: process.env.NODE_ENV !== "production"
    },
    output:
    {
        filename: "[name].js",
        libraryTarget: "commonjs2",
        path: path.join(__dirname, "../dist/web")
    },
    plugins:
    [
        new webpack.NoEmitOnErrorsPlugin()
    ]
}

/**
 * Adjust appConfig for development settings
 */
if(process.env.NODE_ENV !== "production")
{
    appConfig.plugins.push
    (
        new webpack.DefinePlugin
        ({
            "__static": `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`
        })
    );
}

/**
 * Adjust appConfig for production settings
 */
if(process.env.NODE_ENV === "production")
{
    appConfig.plugins.push
    (
        new BabiliWebpackPlugin(),
        new webpack.DefinePlugin
        ({
            "process.env.NODE_ENV": '"production"'
        })
    );
}

module.exports = appConfig;
