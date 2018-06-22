"use strict"

process.env.NODE_ENV = "production";

const { say } = require("cfonts");
const chalk = require("chalk");
const del = require("del");
const packager = require("electron-packager");
const webpack = require("webpack");
const Multispinner = require("multispinner");

const distConfig = require("./dist.config");
const appConfig = require("./webpack.app.config");
const webConfig = require("./webpack.web.config");

const doneLog = chalk.bgGreen.white(" DONE ") + " ";
const errorLog = chalk.bgRed.white(" ERROR ") + " ";
const okayLog = chalk.bgBlue.white(" OKAY ") + " ";
const isCI = process.env.CI || false;

function greeting()
{
    const cols = process.stdout.columns;
    
    let text = "";
    
    if(cols > 85)
    {
        text = "building";
    }
    else
    {
        text = false;
    }
    
    if(text && !isCI)
    {
        say(text,
        {
            colors: ["yellow"],
            font: "simple3d",
            space: false
        })
    }
    else
    {
        console.log(chalk.yellow.bold("\n  building"));
    }
    
    console.log();
}

function clean()
{
    del.sync(["dist/*"]);

    console.log(`\n${doneLog}\n`);

    process.exit();
}

function build()
{
    greeting();
    
    del.sync(["dist/*"]);
    
    const tasks = ["app", "web"];

    const spinner = new Multispinner(tasks,
    {
        preText: "building",
        postText: "process"
    })

    let results = "";

    spinner.on("success", () =>
    {
        process.stdout.write("\x1B[2J\x1B[0f");
        console.log(`\n\n${results}`);
        console.log(`${okayLog}take it away ${chalk.yellow("`electron-packager`")}\n`);

        bundleApp();
    });

    pack(appConfig).then(result =>
    {
        results += result + "\n\n";

        spinner.success("app");
    })
    .catch(err =>
    {
        spinner.error("app");
        console.log(`\n  ${errorLog}failed to build app process`);
        console.error(`\n${err}\n`);
        process.exit(1);
    });

    pack(webConfig).then(result =>
    {
        results += result + "\n\n";

        spinner.success("web");
    })
    .catch(err =>
    {
        spinner.error("web");
        console.log(`\n  ${errorLog}failed to build web process`);
        console.error(`\n${err}\n`);
        process.exit(1);
    });
}

function bundleApp()
{
    packager(distConfig, (error, appPaths) =>
    {
        if(error)
        {
            console.log(`\n${errorLog}${chalk.yellow('`electron-packager`')} says...\n`);
            console.log(error + '\n');
        }
        else
        {
            console.log(`\n${doneLog}\n`)
        }
        
        process.exit();
    })
}

function pack(config)
{
    return new Promise((resolve, reject) =>
    {
        webpack(config, (err, stats) =>
        {
            if(err)
            {
                reject(err.stack || err);
            }
            else if(stats.hasErrors())
            {
                let err = ""

                stats.toString
                ({
                    chunks: false,
                    colors: true
                })
                .split(/\r?\n/)
                .forEach(line =>
                {
                    err += `    ${line}\n`;
                });

                reject(err);
            }
            else
            {
                resolve(stats.toString
                ({
                    chunks: false,
                    colors: true
                }));
            }
        });
    });
}

if(process.env.BUILD_TARGET === "clean")
{
    clean();
}
else
{
    build();
}