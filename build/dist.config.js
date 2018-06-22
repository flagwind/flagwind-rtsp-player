const path = require("path");

/**
 * `electron-packager` 配置说明
 * https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
 */
module.exports = 
{
    "prune": true,
    // "platform": "win32",
    // "arch": "ia32",
    "asar": false,
    "dir": path.join(__dirname, "../"),
    "icon": path.join(__dirname, "./app.ico"),
    "ignore": /(^\/(src|test|\.[a-z]+|README|tsconfig|tslint|yarn|static|ui|build|appveyor))|\.gitkeep/,
    "out": path.join(__dirname, "../dist/app"),
    "overwrite": true,
    "appVersion": "1.0.0",
    "appCopyright": "Copyright (C) 2010-present Flagwind Inc. All rights reserved.",
    "win32metadata":
    {
        "CompanyName": "Flagwind",
        "ProductName": "flagwind-rtsp-player",
        "FileDescription": "Flagwind RTSP Player"
    }
}
