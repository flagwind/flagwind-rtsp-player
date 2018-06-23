const utils = require("./utils");
const sourceMapEnabled = false;
const isProduction = process.env.NODE_ENV === "production";

module.exports =
{
    loaders: utils.cssLoaders
    ({
        sourceMap: sourceMapEnabled,
        extract: isProduction
    }),
    cssSourceMap: sourceMapEnabled,
    cacheBusting: true,
    transformToRequire:
    {
        video: ["src", "poster"],
        source: "src",
        img: "src",
        image: "xlink:href"
    }
}
